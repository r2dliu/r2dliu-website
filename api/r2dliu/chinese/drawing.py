"""Score a freely drawn character and recognise what was written.

Drawings and the reference (Make Me a Hanzi stroke medians) are both
normalised to a unit box, so position and size don't matter. Each drawn stroke
is paired with the reference stroke it best matches (optimal assignment, so
order doesn't affect pairing), then scored on shape. Stroke count, direction
and order are reported separately; accuracy combines shape and count.

Recognition scores the drawing against common characters with a similar
stroke count and returns the closest matches.
"""

import math
from dataclasses import dataclass, field

from r2dliu.chinese.models import Character, Stroke

Point = tuple[float, float]
Polyline = list[Point]

RESAMPLE_POINTS = 16
# Mean point distance (in the unit box) at which a stroke scores zero
SHAPE_TOLERANCE = 0.3
RECOGNITION_MAX_RANK = 5000
RECOGNITION_STROKE_SLACK = 2
RECOGNITION_SHORTLIST = 40


# ---------------------------------------------------------------------------
# Geometry
# ---------------------------------------------------------------------------


def _normalise(strokes: list[Polyline]) -> list[Polyline]:
    """Centre on the bounding box and scale its longer side to 1."""
    xs = [x for s in strokes for x, _ in s]
    ys = [y for s in strokes for _, y in s]
    cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    size = max(max(xs) - min(xs), max(ys) - min(ys)) or 1.0
    return [[((x - cx) / size, (y - cy) / size) for x, y in s] for s in strokes]


def _resample(stroke: Polyline, n: int = RESAMPLE_POINTS) -> Polyline:
    """n points evenly spaced along the stroke's length."""
    if len(stroke) == 1:
        return stroke * n
    lengths = [0.0]
    for (x0, y0), (x1, y1) in zip(stroke, stroke[1:]):
        lengths.append(lengths[-1] + math.hypot(x1 - x0, y1 - y0))
    total = lengths[-1]
    if total == 0:
        return [stroke[0]] * n
    out, j = [], 0
    for i in range(n):
        target = total * i / (n - 1)
        while j < len(lengths) - 2 and lengths[j + 1] < target:
            j += 1
        seg = lengths[j + 1] - lengths[j] or 1.0
        t = (target - lengths[j]) / seg
        (x0, y0), (x1, y1) = stroke[j], stroke[j + 1]
        out.append((x0 + (x1 - x0) * t, y0 + (y1 - y0) * t))
    return out


def _prepare(strokes: list[Polyline]) -> list[Polyline]:
    return [_resample(s) for s in _normalise(strokes)]


def _mean_distance(a: Polyline, b: Polyline) -> float:
    return sum(math.hypot(ax - bx, ay - by) for (ax, ay), (bx, by) in zip(a, b)) / len(
        a
    )


def _stroke_distance(drawn: Polyline, ref: Polyline) -> tuple[float, bool]:
    """Shape distance and whether the stroke went the right way."""
    forward = _mean_distance(drawn, ref)
    backward = _mean_distance(drawn[::-1], ref)
    return min(forward, backward), forward <= backward


def _assign(cost: list[list[float]]) -> list[tuple[int, int]]:
    """Minimum-cost pairing of rows to columns (Hungarian algorithm).

    Works for rectangular matrices; returns min(rows, cols) pairs.
    """
    rows, cols = len(cost), len(cost[0])
    transpose = rows > cols
    if transpose:
        cost = [list(c) for c in zip(*cost)]
        rows, cols = cols, rows
    inf = float("inf")
    u, v = [0.0] * (rows + 1), [0.0] * (cols + 1)
    match, way = [0] * (cols + 1), [0] * (cols + 1)
    for i in range(1, rows + 1):
        match[0], j0 = i, 0
        minv, used = [inf] * (cols + 1), [False] * (cols + 1)
        while True:
            used[j0] = True
            i0, delta, j1 = match[j0], inf, 0
            for j in range(1, cols + 1):
                if not used[j]:
                    cur = cost[i0 - 1][j - 1] - u[i0] - v[j]
                    if cur < minv[j]:
                        minv[j], way[j] = cur, j0
                    if minv[j] < delta:
                        delta, j1 = minv[j], j
            for j in range(cols + 1):
                if used[j]:
                    u[match[j]] += delta
                    v[j] -= delta
                else:
                    minv[j] -= delta
            j0 = j1
            if match[j0] == 0:
                break
        while j0:
            j1 = way[j0]
            match[j0] = match[j1]
            j0 = j1
    pairs = [(match[j] - 1, j - 1) for j in range(1, cols + 1) if match[j]]
    return [(c, r) for r, c in pairs] if transpose else pairs


def _longest_increasing(seq: list[int]) -> int:
    tails: list[int] = []
    for x in seq:
        lo, hi = 0, len(tails)
        while lo < hi:
            mid = (lo + hi) // 2
            if tails[mid] < x:
                lo = mid + 1
            else:
                hi = mid
        tails[lo : lo + 1] = [x]
    return len(tails)


# ---------------------------------------------------------------------------
# Scoring
# ---------------------------------------------------------------------------


@dataclass
class StrokeMatch:
    drawn_index: int
    ref_index: int
    score: float  # 0..1
    correct_direction: bool


@dataclass
class DrawingScore:
    accuracy: float  # 0..100
    shape: float  # 0..100, average over matched strokes
    drawn_strokes: int
    expected_strokes: int
    in_order: int  # strokes drawn in the right relative order
    correct_direction: int
    matches: list[StrokeMatch] = field(default_factory=list)


def score_prepared(drawn: list[Polyline], ref: list[Polyline]) -> DrawingScore:
    if not drawn or not ref:
        return DrawingScore(0, 0, len(drawn), len(ref), 0, 0)
    dist = [[_stroke_distance(d, r) for r in ref] for d in drawn]
    pairs = _assign([[d[0] for d in row] for row in dist])
    matches = []
    for di, ri in sorted(pairs):
        d, right_way = dist[di][ri]
        matches.append(
            StrokeMatch(di, ri, max(0.0, 1 - d / SHAPE_TOLERANCE), right_way)
        )
    total = sum(m.score for m in matches)
    shape = 100 * total / len(matches)
    # Missing or extra strokes count as zero-scoring strokes
    accuracy = 100 * total / max(len(drawn), len(ref))
    return DrawingScore(
        accuracy=round(accuracy, 1),
        shape=round(shape, 1),
        drawn_strokes=len(drawn),
        expected_strokes=len(ref),
        in_order=_longest_increasing([m.ref_index for m in matches]),
        correct_direction=sum(m.correct_direction for m in matches),
        matches=matches,
    )


def reference_strokes(char: Character) -> list[Polyline]:
    return [[tuple(p) for p in s.median] for s in char.strokes.all()]


def clean_input(strokes) -> list[Polyline]:
    """Validate the client's strokes: lists of [x, y] points."""
    if not isinstance(strokes, list) or len(strokes) > 64:
        raise ValueError("strokes must be a list of at most 64 strokes")
    out = []
    for s in strokes:
        if not isinstance(s, list) or not s or len(s) > 2000:
            raise ValueError("each stroke must be a non-empty list of points")
        out.append([(float(p[0]), float(p[1])) for p in s])
    return out


def score_drawing(char: Character, strokes: list[Polyline]) -> DrawingScore:
    return score_prepared(_prepare(strokes), _prepare(reference_strokes(char)))


# ---------------------------------------------------------------------------
# Recognition
# ---------------------------------------------------------------------------

# hanzi -> prepared reference strokes, for common characters. Loaded lazily.
Candidate = tuple[str, list[Polyline], list[Polyline]]  # hanzi, full, coarse
_candidates: dict[int, list[Candidate]] | None = None


def _load_candidates() -> dict[int, list[Candidate]]:
    global _candidates
    if _candidates is None:
        by_char: dict[str, list[Polyline]] = {}
        rows = (
            Stroke.objects.filter(character__frequency_rank__lte=RECOGNITION_MAX_RANK)
            .order_by("character__frequency_rank", "order")
            .values_list("character__hanzi", "median")
        )
        for hanzi, median in rows.iterator(chunk_size=5000):
            by_char.setdefault(hanzi, []).append([tuple(p) for p in median])
        grouped: dict[int, list[Candidate]] = {}
        for hanzi, strokes in by_char.items():
            prepared = _prepare(strokes)
            grouped.setdefault(len(strokes), []).append(
                (hanzi, prepared, _coarse(prepared))
            )
        _candidates = grouped
    return _candidates


def _coarse(strokes: list[Polyline]) -> list[Polyline]:
    step = (RESAMPLE_POINTS - 1) // 3
    return [s[::step] for s in strokes]


def _quick_distance(drawn: list[Polyline], ref: list[Polyline]) -> float:
    """Cheap, order-independent comparison used to shortlist candidates:
    how far each stroke is from its nearest counterpart, both ways."""
    dist = [[_stroke_distance(d, r)[0] for r in ref] for d in drawn]
    to_ref = sum(min(row) for row in dist) / len(drawn)
    to_drawn = sum(min(col) for col in zip(*dist)) / len(ref)
    return to_ref + to_drawn


def recognise(strokes: list[Polyline], limit: int = 5) -> list[tuple[str, float]]:
    """The characters the drawing most resembles, with their accuracy."""
    if not strokes:
        return []
    drawn = _prepare(strokes)
    groups = _load_candidates()
    pool = [
        c
        for n in range(
            len(drawn) - RECOGNITION_STROKE_SLACK,
            len(drawn) + RECOGNITION_STROKE_SLACK + 1,
        )
        for c in groups.get(n, [])
    ]
    coarse = _coarse(drawn)
    shortlist = sorted(pool, key=lambda c: _quick_distance(coarse, c[2]))[
        :RECOGNITION_SHORTLIST
    ]
    scored = [(h, score_prepared(drawn, ref).accuracy) for h, ref, _ in shortlist]
    scored.sort(key=lambda x: -x[1])
    return scored[:limit]
