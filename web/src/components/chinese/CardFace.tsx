import { HanziCanvas } from './HanziCanvas'
import type { Card, Character } from '../../helpers/chinese/api'

export function Meta({
  frequencyRank,
  hskLevel,
}: {
  frequencyRank: number | null
  hskLevel: number | null
}) {
  return (
    <div className="flex gap-2 text-xs uppercase tracking-wide text-zinc-400">
      {frequencyRank && <span>#{frequencyRank} most common</span>}
      {hskLevel && hskLevel <= 6 && <span>HSK {hskLevel}</span>}
    </div>
  )
}

export function Definition({ text }: { text: string }) {
  return (
    <div className="whitespace-pre-line font-['HelveticaNeueLight'] text-lg leading-snug">
      {text}
    </div>
  )
}

/** Front of the card: just the hanzi. */
export function CardFront({ card }: { card: Card }) {
  return (
    <div className="flex flex-col items-center gap-2 py-6">
      <div className="text-[96px] leading-none max-md:text-[72px]">
        {card.hanzi}
      </div>
    </div>
  )
}

function CharacterBreakdown({ chars }: { chars: Array<Character> }) {
  return (
    <div className="flex flex-col gap-3">
      {chars.map((c, i) => (
        <div key={`${c.hanzi}-${i}`} className="flex items-start gap-4">
          <HanziCanvas hanzi={c.hanzi} mode="animate" size={96} />
          <div className="flex min-w-0 flex-col gap-1">
            <div className="font-['HelveticaNeueMedium'] text-lg">
              {c.hanzi} · {c.pinyin.join(', ')}
            </div>
            <div className="line-clamp-3 whitespace-pre-line font-['HelveticaNeueLight'] text-sm text-zinc-300">
              {c.definition}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/** Back of the card: readings, meaning, stroke order. */
export function CardBack({ card }: { card: Card }) {
  if (card.character) {
    const c = card.character
    return (
      <div className="flex gap-6 max-md:flex-col max-md:items-center">
        <HanziCanvas hanzi={c.hanzi} mode="animate" size={200} />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="font-['HelveticaNeueMedium'] text-3xl">
            {c.pinyin.join(' / ')}
          </div>
          {c.traditional && (
            <div className="text-zinc-400">Traditional: {c.traditional}</div>
          )}
          <Meta frequencyRank={c.frequencyRank} hskLevel={c.hskLevel} />
          <Definition text={c.definition} />
        </div>
      </div>
    )
  }
  const w = card.word!
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="font-['HelveticaNeueMedium'] text-3xl">{w.pinyin}</div>
        {w.traditional && w.traditional !== w.simplified && (
          <div className="text-zinc-400">Traditional: {w.traditional}</div>
        )}
        <Meta frequencyRank={w.frequencyRank} hskLevel={w.hskLevel} />
        <Definition text={w.definition} />
      </div>
      <CharacterBreakdown chars={w.characters} />
    </div>
  )
}
