import cn from 'classnames'
import { useState } from 'react'

import { useStudyStore } from '../../stores/chinese/studyStore'
import { useDefinition, useT } from '../../helpers/chinese/i18n'
import { Expandable } from './ui'
import type { Card, Character, Sentence } from '../../helpers/chinese/api'

export function Meta({
  frequencyRank,
  hskLevel,
}: {
  frequencyRank: number | null
  hskLevel: number | null
}) {
  const t = useT()
  return (
    <div className="flex gap-2 text-xs uppercase tracking-wide text-zinc-400">
      {frequencyRank && <span>{t('mostCommon', { n: frequencyRank })}</span>}
      {hskLevel && hskLevel <= 6 && <span>HSK {hskLevel}</span>}
    </div>
  )
}

/** A definition, clamped to a few lines; tap to expand. */
export function Definition({
  text,
  lines = 4,
  className,
}: {
  text: string
  lines?: number
  className?: string
}) {
  const t = useT()
  return (
    <Expandable
      lines={lines}
      moreLabel={t('more')}
      lessLabel={t('less')}
      className={cn(
        "whitespace-pre-line font-['HelveticaNeueLight'] leading-snug md:text-lg",
        className,
      )}
    >
      {text}
    </Expandable>
  )
}

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
  const definition = useDefinition()
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
            <Definition
              text={definition(c)}
              lines={2}
              className="text-sm text-zinc-300 md:!text-sm"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Example sentences, the card's word highlighted, pinyin above each word.
 * In Chinese mode the English translation shows on tap.
 */
export function Examples({
  sentences,
  hanzi,
}: {
  sentences: Array<Sentence>
  hanzi: string
}) {
  const t = useT()
  const zh = useStudyStore((s) => s.language) === 'zh'
  const [shown, setShown] = useState<Set<string>>(new Set())
  if (!sentences.length) return null

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs uppercase tracking-wide text-zinc-500">
        {t('examples')}
      </div>
      {sentences.map((s) => (
        <div
          key={s.id}
          className={cn('flex flex-col gap-0.5', zh && 'cursor-pointer')}
          onClick={() =>
            zh &&
            setShown((prev) => {
              const next = new Set(prev)
              if (next.has(s.id)) next.delete(s.id)
              else next.add(s.id)
              return next
            })
          }
        >
          <div className="flex flex-wrap items-end gap-x-1 gap-y-1">
            {s.tokens.map((tok, i) => (
              <ruby
                key={i}
                className={cn(
                  'text-lg leading-tight',
                  tok.text.includes(hanzi) ? 'text-sky-300' : 'text-zinc-300',
                )}
              >
                {tok.text}
                <rt className="pb-0.5 text-[10px] text-zinc-500">
                  {tok.pinyin}
                </rt>
              </ruby>
            ))}
          </div>
          {(!zh || shown.has(s.id)) && (
            <div className="font-['HelveticaNeueLight'] text-sm text-zinc-400">
              {s.english}
            </div>
          )}
        </div>
      ))}
      <div className="text-[10px] text-zinc-600">
        {zh ? `${t('showTranslation')} · ` : ''}
        {t('examplesSource')}
      </div>
    </div>
  )
}

/** Back of the card: readings, meaning and example sentences. */
export function CardBack({ card }: { card: Card }) {
  const t = useT()
  const definition = useDefinition()
  if (card.character) {
    const c = card.character
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <div className="font-['HelveticaNeueMedium'] text-2xl md:text-3xl">
            {c.pinyin.join(' / ')}
          </div>
          {c.traditional && (
            <div className="text-zinc-400">
              {t('traditional', { t: c.traditional })}
            </div>
          )}
          <Meta frequencyRank={c.frequencyRank} hskLevel={c.hskLevel} />
          <Definition text={definition(c)} />
        </div>
        <Examples sentences={card.examples} hanzi={card.hanzi} />
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
          <div className="text-zinc-400">
            {t('traditional', { t: w.traditional })}
          </div>
        )}
        <Meta frequencyRank={w.frequencyRank} hskLevel={w.hskLevel} />
        <Definition text={definition(w)} />
      </div>
      <Examples sentences={card.examples} hanzi={card.hanzi} />
      <CharacterBreakdown chars={w.characters} />
    </div>
  )
}
