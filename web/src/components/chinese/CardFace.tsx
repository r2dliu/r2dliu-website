import cn from 'classnames'
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
    <div className="line-clamp-4 whitespace-pre-line font-['HelveticaNeueLight'] leading-snug md:line-clamp-none md:text-lg">
      {text}
    </div>
  )
}

/** Front of the card: just the hanzi. */
/** Front of the card: the hanzi. Smaller once the answer is showing. */
export function CardFront({
  card,
  compact = false,
}: {
  card: Card
  compact?: boolean
}) {
  return (
    <div
      className={cn('flex flex-col items-center', compact ? 'py-0' : 'py-6')}
    >
      <div
        className={cn(
          'leading-none',
          compact
            ? 'text-[64px] max-md:text-[48px]'
            : 'text-[96px] max-md:text-[72px]',
        )}
      >
        {card.hanzi}
      </div>
    </div>
  )
}

function CharacterBreakdown({ chars }: { chars: Array<Character> }) {
  return (
    <div className="flex flex-col gap-2 md:gap-3">
      {chars.map((c, i) => (
        <div
          key={`${c.hanzi}-${i}`}
          className="flex items-start gap-3 md:gap-4"
        >
          <div className="w-9 shrink-0 text-center text-3xl leading-none md:w-14 md:text-5xl">
            {c.hanzi}
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <div className="font-['HelveticaNeueMedium'] md:text-lg">
              {c.pinyin.join(', ')}
            </div>
            <div className="line-clamp-2 whitespace-pre-line md:line-clamp-3 font-['HelveticaNeueLight'] text-sm text-zinc-300">
              {c.definition}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/** Back of the card: readings and meaning. */
export function CardBack({ card }: { card: Card }) {
  if (card.character) {
    const c = card.character
    return (
      <div className="flex flex-col gap-2">
        <div className="font-['HelveticaNeueMedium'] text-2xl md:text-3xl">
          {c.pinyin.join(' / ')}
        </div>
        {c.traditional && (
          <div className="text-zinc-400">Traditional: {c.traditional}</div>
        )}
        <Meta frequencyRank={c.frequencyRank} hskLevel={c.hskLevel} />
        <Definition text={c.definition} />
      </div>
    )
  }
  const w = card.word!
  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <div className="flex flex-col gap-1 md:gap-2">
        <div className="font-['HelveticaNeueMedium'] text-2xl md:text-3xl">
          {w.pinyin}
        </div>
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
