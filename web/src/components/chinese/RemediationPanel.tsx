import cn from 'classnames'
import { useEffect, useState } from 'react'

import { useStudyStore } from '../../stores/chinese/studyStore'
import { api } from '../../helpers/chinese/api'
import { useDefinition, useT } from '../../helpers/chinese/i18n'
import { CardBack } from './CardFace'
import { DrawingPad } from './DrawingPad'
import { FreeDrawPad } from './FreeDrawPad'
import { RelatedList } from './RelatedList'
import { Btn, Input } from './ui'
import type {
  Card,
  RelatedItem,
  Remediation,
  RemediationStep,
} from '../../helpers/chinese/api'

interface StepProps {
  card: Card
  remediation: Remediation
  step: RemediationStep
}

// ---------------------------------------------------------------------------
// DRAW_STROKES
// ---------------------------------------------------------------------------

function DrawStrokesStep({ card, remediation, step }: StepProps) {
  const { run, setStudy } = useStudyStore()
  const t = useT()
  const targets = step.drawTargets ?? []
  const progress = step.drawProgress ?? {}
  const reps = Number(step.config.repetitions)
  const maxMistakes = Number(step.config.maxMistakes)
  const minAccuracy = Number(step.config.minAccuracy)
  // Steps saved before free draw existed have no mode: they were traced
  const free = step.config.mode === 'FREE'
  const current = targets.find((h) => (progress[h] ?? 0) < reps) ?? targets[0]
  // The character on the pad. Progress updates as soon as a drawing counts,
  // but the pad keeps showing that drawing's result until "Draw again".
  const [target, setTarget] = useState(current)
  const [attempt, setAttempt] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  // Whether the last free drawing counted (after the task is done, drawing
  // is just practice)
  const [counted, setCounted] = useState(false)

  useEffect(() => setMistakes(0), [target, attempt])

  const nextDrawing = () => {
    setTarget(current)
    setAttempt((a) => a + 1)
  }

  const onComplete = async (totalMistakes: number) => {
    const result = await run(() =>
      api.completeStrokeQuiz(remediation.id, target, totalMistakes),
    )
    if (!result) return
    setMessage(
      t(result.counted ? 'tracedOk' : 'tracedBad', {
        c: target,
        m: totalMistakes,
        max: maxMistakes,
      }),
    )
    setStudy(result.study)
    // Tracing has no result to look at: go straight to the next one
    nextDrawing()
  }

  // Tracing moves on by itself; keep its pad on the character still to do
  useEffect(() => {
    if (!free) setTarget(current)
  }, [free, current])

  return (
    <div className="flex gap-6 max-md:flex-col max-md:items-center">
      {free ? (
        <FreeDrawPad
          key={`${target}-${attempt}`}
          hanzi={target}
          onReset={nextDrawing}
          onSubmit={async (strokes) => {
            const r = await run(() =>
              api.submitFreeDrawing(remediation.id, target, strokes),
            )
            if (!r) return null
            setCounted(r.counted)
            setStudy(r.study)
            return r.result
          }}
          footer={(r) =>
            counted ? (
              <div className="text-sm text-green-400">{t('counted')}</div>
            ) : !step.satisfied && r.accuracy < minAccuracy ? (
              <div className="text-sm text-red-300">
                {t('needsAccuracy', { n: minAccuracy })}
              </div>
            ) : null
          }
        />
      ) : (
        <div className="flex flex-col items-center gap-2">
          <DrawingPad
            key={`${target}-${attempt}`}
            hanzi={target}
            showOutline={Boolean(step.config.showOutline)}
            onMistake={setMistakes}
            onComplete={onComplete}
          />
          <div
            className={cn('text-sm', {
              'text-red-400': mistakes > maxMistakes,
              'text-zinc-400': mistakes <= maxMistakes,
            })}
          >
            {t('mistakesAllowed', { m: mistakes, max: maxMistakes })}
          </div>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {targets.map((h) => (
            <span
              key={h}
              className={cn('border px-3 py-1 text-xl', {
                'border-white': h === target,
                'border-zinc-700 text-zinc-500': h !== target,
                'border-green-500 text-green-400': (progress[h] ?? 0) >= reps,
              })}
            >
              {h} {Math.min(progress[h] ?? 0, reps)}/{reps}
            </span>
          ))}
        </div>
        {message && <div className="text-zinc-300">{message}</div>}
        <div className="text-sm text-zinc-400">
          {free ? t('drawHintFree', { n: minAccuracy }) : t('drawHintTrace')}
          {!free && !step.config.showOutline && t('noOutline')}
        </div>
        <details className="text-zinc-300">
          <summary className="cursor-pointer text-sm text-zinc-400">
            {t('showCardAgain')}
          </summary>
          <div className="pt-3">
            <CardBack card={card} />
          </div>
        </details>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// EXPLORE_RELATED
// ---------------------------------------------------------------------------

function ExploreRelatedStep({ remediation, step }: StepProps) {
  const { run, setStudy } = useStudyStore()
  const t = useT()
  const opened = new Set(step.openedKeys ?? [])

  const open = async (item: RelatedItem) => {
    if (opened.has(item.key)) return
    // Count it straight away; the server's answer follows
    const { study } = useStudyStore.getState()
    if (study?.remediation) {
      const done = step.done + 1
      useStudyStore.setState({
        study: {
          ...study,
          remediation: {
            ...study.remediation,
            steps: study.remediation.steps.map((s) =>
              s.index === step.index
                ? {
                    ...s,
                    done,
                    satisfied: done >= s.required,
                    openedKeys: [...(s.openedKeys ?? []), item.key],
                  }
                : s,
            ),
          },
        },
      })
    }
    const next = await run(() => api.openRelatedItem(remediation.id, item.key))
    if (next) setStudy(next)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-zinc-300">
        {t('exploreHint', { n: step.required, d: step.done })}
      </div>
      <RelatedList
        items={step.relatedItems ?? []}
        opened={opened}
        onOpen={open}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// TYPE_PINYIN
// ---------------------------------------------------------------------------

function TypePinyinStep({ card, remediation, step }: StepProps) {
  const { run, setStudy } = useStudyStore()
  const t = useT()
  const definition = useDefinition()
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const item = card.character ?? card.word

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!answer.trim()) return
    const result = await run(() => api.submitPinyin(remediation.id, answer))
    if (!result) return
    setFeedback(
      result.correct ? t('correct') : t('notQuite', { x: result.expected }),
    )
    setAnswer('')
    setStudy(result.study)
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="text-[72px] leading-none">{card.hanzi}</div>
      {item && (
        <div className="line-clamp-2 font-['HelveticaNeueLight'] text-zinc-300">
          {definition(item)}
        </div>
      )}
      <div className="flex items-end gap-3">
        <Input
          autoFocus
          label={t('pinyinLabel')}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-80 max-md:flex-1"
          autoComplete="off"
        />
        <Btn type="submit" variant="outlined">
          {t('check')}
        </Btn>
      </div>
      <div className="text-sm text-zinc-400">
        {t('correctCount', { d: step.done, n: step.required })}
        {step.attempts ? t('attempts', { n: step.attempts }) : ''}
      </div>
      {feedback && <div>{feedback}</div>}
    </form>
  )
}

// ---------------------------------------------------------------------------

const STEP_COMPONENTS = {
  DRAW_STROKES: DrawStrokesStep,
  EXPLORE_RELATED: ExploreRelatedStep,
  TYPE_PINYIN: TypePinyinStep,
}

/**
 * The tasks for a missed card. A finished task stays on screen (to look at
 * the result or keep exploring) until Next; after the last one, Next moves on
 * to the next card.
 */
export function RemediationPanel({
  card,
  remediation,
}: {
  card: Card
  remediation: Remediation
}) {
  const t = useT()
  const pendingNext = useStudyStore((s) => s.pendingNext)
  const advance = useStudyStore((s) => s.advance)
  const [viewIndex, setViewIndex] = useState(remediation.currentStep)
  const step = remediation.steps[viewIndex] ?? remediation.steps[0]
  const StepComponent = STEP_COMPONENTS[step.type]
  const allDone = !!pendingNext
  const canGoOn = allDone || remediation.currentStep > viewIndex

  return (
    <div className="flex flex-col gap-5">
      <div className="border-l-4 border-red-500 pl-4">
        <div className="font-['HelveticaNeueBold'] text-xl">
          {t('missed', { hanzi: card.hanzi })}
        </div>
        <ol className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          {remediation.steps.map((s) => (
            <li
              key={s.index}
              className={cn({
                'text-green-400': s.satisfied,
                "font-['HelveticaNeueBold'] text-white":
                  s.index === viewIndex && !s.satisfied,
                "font-['HelveticaNeueBold']": s.index === viewIndex,
                'text-zinc-500': !s.satisfied && s.index !== viewIndex,
              })}
            >
              {s.index + 1}. {t(s.type)} ({Math.min(s.done, s.required)}/
              {s.required})
            </li>
          ))}
        </ol>
      </div>
      <StepComponent
        key={`${remediation.id}-${step.index}`}
        card={card}
        remediation={remediation}
        step={step}
      />
      {canGoOn && (
        <div className="sticky bottom-0 flex items-center gap-3 border-t border-zinc-800 bg-black py-3">
          <div className="flex-1 text-sm text-green-400">
            {allDone ? t('allDone') : `✓ ${t(step.type)}`}
          </div>
          <Btn
            variant="outlined"
            onClick={() =>
              allDone ? advance() : setViewIndex(remediation.currentStep)
            }
          >
            {t('next')}
          </Btn>
        </div>
      )}
    </div>
  )
}
