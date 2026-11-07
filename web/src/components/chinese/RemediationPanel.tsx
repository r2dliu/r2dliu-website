import cn from 'classnames'
import { useEffect, useState } from 'react'

import { useStudyStore } from '../../stores/chinese/studyStore'
import { api } from '../../helpers/chinese/api'
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
  StudyState,
} from '../../helpers/chinese/api'

export const STEP_LABELS: Record<string, string> = {
  DRAW_STROKES: 'Draw the character',
  EXPLORE_RELATED: 'Explore related vocab',
  TYPE_PINYIN: 'Type the pinyin',
}

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
  const targets = step.drawTargets ?? []
  const progress = step.drawProgress ?? {}
  const reps = Number(step.config.repetitions)
  const maxMistakes = Number(step.config.maxMistakes)
  const minAccuracy = Number(step.config.minAccuracy)
  // Steps saved before free draw existed have no mode: they were traced
  const free = step.config.mode === 'FREE'
  // Free draw: hold the next state until the learner has seen their score
  const [pending, setPending] = useState<StudyState | null>(null)
  const current = targets.find((t) => (progress[t] ?? 0) < reps) ?? targets[0]
  const [attempt, setAttempt] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => setMistakes(0), [current, attempt])

  const onComplete = async (totalMistakes: number) => {
    const result = await run(() =>
      api.completeStrokeQuiz(remediation.id, current, totalMistakes),
    )
    if (!result) return
    setMessage(
      result.counted
        ? `Nice — ${current} drawn with ${totalMistakes} mistake${totalMistakes === 1 ? '' : 's'}.`
        : `${totalMistakes} mistakes (max ${maxMistakes}). Try ${current} again.`,
    )
    setAttempt((a) => a + 1)
    setStudy(result.study)
  }

  return (
    <div className="flex gap-6 max-md:flex-col max-md:items-center">
      {free ? (
        <FreeDrawPad
          key={`${current}-${attempt}`}
          hanzi={current}
          onSubmit={async (strokes) => {
            const r = await run(() =>
              api.submitFreeDrawing(remediation.id, current, strokes),
            )
            if (!r) return null
            setPending(r.counted ? r.study : null)
            if (!r.counted) setStudy(r.study)
            return r.result
          }}
          footer={(r) =>
            r.accuracy >= minAccuracy ? (
              <Btn
                variant="outlined"
                className="mt-1"
                onClick={() => {
                  if (pending) setStudy(pending)
                  setPending(null)
                  setAttempt((a) => a + 1)
                }}
              >
                Passed — continue
              </Btn>
            ) : (
              <div className="text-sm text-red-300">
                Needs {minAccuracy}% to count — draw it again
              </div>
            )
          }
        />
      ) : (
        <div className="flex flex-col items-center gap-2">
          <DrawingPad
            key={`${current}-${attempt}`}
            hanzi={current}
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
            Mistakes: {mistakes} / {maxMistakes} allowed
          </div>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {targets.map((t) => (
            <span
              key={t}
              className={cn('border px-3 py-1 text-xl', {
                'border-white': t === current,
                'border-zinc-700 text-zinc-500': t !== current,
                'border-green-500 text-green-400': (progress[t] ?? 0) >= reps,
              })}
            >
              {t} {Math.min(progress[t] ?? 0, reps)}/{reps}
            </span>
          ))}
        </div>
        {message && <div className="text-zinc-300">{message}</div>}
        <div className="text-sm text-zinc-400">
          {free
            ? `Draw the whole character, then Check. ${minAccuracy}% accuracy counts.`
            : 'Draw each stroke in order on the grid.'}
          {!free && !step.config.showOutline && ' No outline — from memory!'}
        </div>
        <details className="text-zinc-300">
          <summary className="cursor-pointer text-sm text-zinc-400">
            Show the card again
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
  const opened = new Set(step.openedKeys ?? [])

  const open = async (item: RelatedItem) => {
    if (opened.has(item.key)) return
    const next = await run(() => api.openRelatedItem(remediation.id, item.key))
    if (next) setStudy(next)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-zinc-300">
        Open at least {step.required} of these — they share characters with the
        card. Opened {step.done} / {step.required}.
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
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const definition = card.character?.definition ?? card.word?.definition ?? ''

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!answer.trim()) return
    const result = await run(() => api.submitPinyin(remediation.id, answer))
    if (!result) return
    setFeedback(
      result.correct
        ? 'Correct!'
        : `Not quite — it's ${result.expected}. Type it again.`,
    )
    setAnswer('')
    setStudy(result.study)
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="text-[72px] leading-none">{card.hanzi}</div>
      <div className="line-clamp-2 font-['HelveticaNeueLight'] text-zinc-300">
        {definition}
      </div>
      <div className="flex items-end gap-3">
        <Input
          autoFocus
          label="Pinyin with tones (ni3hao3 or nǐhǎo)"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-80 max-md:flex-1"
          autoComplete="off"
        />
        <Btn type="submit" variant="outlined">
          Check
        </Btn>
      </div>
      <div className="text-sm text-zinc-400">
        Correct {step.done} / {step.required}
        {step.attempts ? ` · ${step.attempts} attempts` : ''}
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

export function RemediationPanel({
  card,
  remediation,
}: {
  card: Card
  remediation: Remediation
}) {
  const step = remediation.steps[remediation.currentStep]
  const StepComponent = STEP_COMPONENTS[step.type]

  return (
    <div className="flex flex-col gap-5">
      <div className="border-l-4 border-red-500 pl-4">
        <div className="font-['HelveticaNeueBold'] text-xl">
          Missed {card.hanzi} — finish these before moving on
        </div>
        <ol className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          {remediation.steps.map((s) => (
            <li
              key={s.index}
              className={cn({
                'text-green-400': s.satisfied,
                "font-['HelveticaNeueBold'] text-white":
                  s.index === remediation.currentStep,
                'text-zinc-500':
                  !s.satisfied && s.index !== remediation.currentStep,
              })}
            >
              {s.index + 1}. {STEP_LABELS[s.type]} ({s.done}/{s.required})
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
    </div>
  )
}
