import cn from 'classnames'
import { useEffect, useState } from 'react'

import { useStudyStore } from '../../stores/chinese/studyStore'
import { api } from '../../helpers/chinese/api'
import { useDefinition, useT } from '../../helpers/chinese/i18n'
import { Definition, Meta } from './CardFace'
import { HanziCanvas } from './HanziCanvas'
import { Btn } from './ui'
import type { Character, RelatedItem, Word } from '../../helpers/chinese/api'

function RelatedDetail({ item }: { item: RelatedItem }) {
  const t = useT()
  const definition = useDefinition()
  const [detail, setDetail] = useState<
    (Character & { words?: Array<Word> }) | Word | null
  >(null)
  useEffect(() => {
    const load =
      item.kind === 'CHARACTER'
        ? api.character(item.hanzi)
        : api.word(item.hanzi)
    load.then(setDetail).catch(() => setDetail(null))
  }, [item])

  const chars =
    detail && 'characters' in detail
      ? detail.characters
      : [{ hanzi: item.hanzi } as Character]
  return (
    <div className="flex flex-col gap-3 pt-3">
      <Definition text={definition(item)} />
      <div className="flex flex-wrap gap-3">
        {chars.map((c, i) => (
          <HanziCanvas
            key={`${c.hanzi}-${i}`}
            hanzi={c.hanzi}
            mode="animate"
            size={90}
          />
        ))}
      </div>
      {detail && 'words' in detail && detail.words?.length ? (
        <div className="text-sm text-zinc-400">
          {t('alsoIn')}
          {detail.words.map((w) => `${w.simplified} (${w.pinyin})`).join(', ')}
        </div>
      ) : null}
    </div>
  )
}

/**
 * First line of a definition worth showing in a row: skips reading headers
 * ("méi") and sense numbers ("⒈ ").
 */
function summary(definition: string) {
  const line =
    definition
      .split('\n')
      .find(
        (l) => l.trim() && !/^[a-zāáǎàēéěèīíǐìōóǒòūúǔùüǖǘǚǜ\s]+$/i.test(l),
      ) ?? ''
  return line.replace(/^[⒈-⒛]\s*/, '')
}

/**
 * Vocab sharing characters with a card. Items expand to show details and can
 * be added to the deck. Pass `opened` to show which have been looked at.
 */
export function RelatedList({
  items,
  opened,
  onOpen,
}: {
  items: Array<RelatedItem>
  opened?: Set<string>
  onOpen?: (item: RelatedItem) => void
}) {
  const { run, deckId, study } = useStudyStore()
  const t = useT()
  const definition = useDefinition()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [added, setAdded] = useState<Set<string>>(new Set())
  const deckKind = study?.deck.cardKind

  const add = async (item: RelatedItem) => {
    if (!deckId) return
    const ok = await run(() => api.addToDeck(deckId, item.hanzi))
    if (ok) setAdded(new Set([...added, item.key]))
  }

  if (!items.length) {
    return <div className="text-zinc-400">{t('noRelated')}</div>
  }

  return (
    <ul className="flex flex-col divide-y divide-zinc-800 border border-zinc-800">
      {items.map((item) => (
        <li key={item.key} className="px-4 py-3">
          <button
            type="button"
            onClick={() => {
              setExpanded(expanded === item.key ? null : item.key)
              onOpen?.(item)
            }}
            className="flex w-full cursor-pointer items-baseline gap-4 bg-transparent text-left text-white"
          >
            {opened && (
              <span
                className={cn('w-4 text-sm', {
                  'text-green-400': opened.has(item.key),
                  'text-zinc-600': !opened.has(item.key),
                })}
              >
                {opened.has(item.key) ? '✓' : '○'}
              </span>
            )}
            <span className="min-w-16 text-2xl">{item.hanzi}</span>
            <span className="min-w-24 font-['HelveticaNeueMedium']">
              {item.pinyin}
            </span>
            <span className="flex-1 truncate font-['HelveticaNeueLight'] text-zinc-300">
              {summary(definition(item))}
            </span>
            <span className="max-md:hidden">
              <Meta
                frequencyRank={item.frequencyRank}
                hskLevel={item.hskLevel}
              />
            </span>
          </button>
          {expanded === item.key && (
            <div className={opened ? 'pl-8' : ''}>
              <RelatedDetail item={item} />
              {item.kind === deckKind && (
                <Btn
                  variant="outlined"
                  className="mt-3"
                  disabled={added.has(item.key)}
                  onClick={() => add(item)}
                >
                  {added.has(item.key) ? t('addedToDeck') : t('addToDeck')}
                </Btn>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
