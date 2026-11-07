import { useEffect, useState } from 'react'

import { useStudyStore } from '../../stores/chinese/studyStore'
import { api } from '../../helpers/chinese/api'
import { useT } from '../../helpers/chinese/i18n'
import { Btn, Input, Select } from './ui'
import type { StringKey } from '../../helpers/chinese/i18n'
import type {
  Deck,
  FailureStep,
  FailureStepType,
} from '../../helpers/chinese/api'

// Select-style options and their choices (labels are in i18n as choice_*)
const SELECT_OPTIONS: Record<string, Array<string>> = {
  characters: ['ALL', 'FIRST'],
  mode: ['FREE', 'TRACE'],
}

function StepEditor({
  step: saved,
  defaults,
  onChange,
}: {
  step: FailureStep
  /** Fills in options added after this step was saved */
  defaults?: Record<string, unknown>
  onChange: (s: FailureStep) => void
}) {
  const t = useT()
  const step = { ...defaults, ...saved }
  return (
    <div className="flex flex-wrap items-center gap-4">
      {Object.entries(step)
        .filter(([key]) => key !== 'type')
        .map(([key, value]) => {
          const optionKey = `opt_${key}` as StringKey
          const label = t(optionKey) || key
          if (typeof value === 'boolean') {
            return (
              <label key={key} className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    onChange({ ...step, [key]: e.target.checked })
                  }
                  className="h-4 w-4 accent-white"
                />
                {label}
              </label>
            )
          }
          if (key in SELECT_OPTIONS) {
            return (
              <Select
                key={key}
                label={label}
                value={String(value)}
                onChange={(e) => onChange({ ...step, [key]: e.target.value })}
                className="w-56"
              >
                {SELECT_OPTIONS[key].map((v) => (
                  <option key={v} value={v}>
                    {t(`choice_${v}` as StringKey)}
                  </option>
                ))}
              </Select>
            )
          }
          return (
            <Input
              key={key}
              type="number"
              label={label}
              value={value as number}
              onChange={(e) =>
                onChange({ ...step, [key]: Number(e.target.value) })
              }
              className="w-44"
            />
          )
        })}
    </div>
  )
}

export function DeckSettings({
  deck,
  onClose,
}: {
  deck: Deck
  onClose: () => void
}) {
  const { updateDeck, deleteDeck, busy } = useStudyStore()
  const t = useT()
  const [stepTypes, setStepTypes] = useState<
    Array<{ type: FailureStepType; defaults: Record<string, unknown> }>
  >([])
  const [form, setForm] = useState(() => ({
    name: deck.name,
    newCardsPerDay: deck.newCardsPerDay,
    learningSteps: deck.learningSteps.join(' '),
    relearnDelayMinutes: deck.relearnDelayMinutes,
    failureSteps: deck.failureSteps,
  }))

  useEffect(() => {
    api.failureStepTypes().then(setStepTypes)
  }, [])

  const setSteps = (failureSteps: Array<FailureStep>) =>
    setForm({ ...form, failureSteps })
  const move = (i: number, delta: number) => {
    const steps = [...form.failureSteps]
    const [s] = steps.splice(i, 1)
    steps.splice(i + delta, 0, s)
    setSteps(steps)
  }

  const save = async () => {
    await updateDeck({
      name: form.name,
      newCardsPerDay: form.newCardsPerDay,
      learningSteps: form.learningSteps
        .split(/[\s,]+/)
        .filter(Boolean)
        .map(Number),
      relearnDelayMinutes: form.relearnDelayMinutes,
      failureSteps: form.failureSteps,
    })
    if (!useStudyStore.getState().error) onClose()
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-wrap gap-4">
        <Input
          label={t('deckName')}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          type="number"
          label={t('newPerDay')}
          value={form.newCardsPerDay}
          onChange={(e) =>
            setForm({ ...form, newCardsPerDay: Number(e.target.value) })
          }
          className="w-36"
        />
        <Input
          label={t('learningSteps')}
          value={form.learningSteps}
          onChange={(e) => setForm({ ...form, learningSteps: e.target.value })}
          className="w-48"
        />
        <Input
          type="number"
          label={t('relearnDelay')}
          value={form.relearnDelayMinutes}
          onChange={(e) =>
            setForm({ ...form, relearnDelayMinutes: Number(e.target.value) })
          }
          className="w-56"
        />
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <div className="font-['HelveticaNeueBold'] text-xl">
            {t('whenAgain')}
          </div>
          <div className="text-sm text-zinc-400">{t('whenAgainHint')}</div>
        </div>
        {form.failureSteps.length === 0 && (
          <div className="text-zinc-500">{t('noTasks')}</div>
        )}
        {form.failureSteps.map((step, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 border border-zinc-700 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="font-['HelveticaNeueMedium']">
                {i + 1}. {t(step.type)}
              </div>
              <div className="flex gap-1">
                <Btn
                  variant="text"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                  aria-label="Move up"
                >
                  ↑
                </Btn>
                <Btn
                  variant="text"
                  disabled={i === form.failureSteps.length - 1}
                  onClick={() => move(i, 1)}
                  aria-label="Move down"
                >
                  ↓
                </Btn>
                <Btn
                  variant="text"
                  onClick={() =>
                    setSteps(form.failureSteps.filter((_, j) => j !== i))
                  }
                >
                  {t('remove')}
                </Btn>
              </div>
            </div>
            <StepEditor
              step={step}
              defaults={stepTypes.find((st) => st.type === step.type)?.defaults}
              onChange={(s) =>
                setSteps(form.failureSteps.map((x, j) => (j === i ? s : x)))
              }
            />
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          {stepTypes.map(({ type, defaults }) => (
            <Btn
              key={type}
              variant="outlined"
              onClick={() =>
                setSteps([...form.failureSteps, { ...defaults, type }])
              }
            >
              + {t(type)}
            </Btn>
          ))}
        </div>
      </section>

      <div className="flex gap-3">
        <Btn variant="outlined" onClick={save} disabled={busy}>
          {t('save')}
        </Btn>
        <Btn variant="text" onClick={onClose}>
          {t('cancel')}
        </Btn>
        <div className="flex-1" />
        <Btn
          variant="text"
          className="text-red-400"
          onClick={() => {
            if (window.confirm(t('confirmDelete', { name: deck.name }))) {
              deleteDeck().then(onClose)
            }
          }}
        >
          {t('deleteDeck')}
        </Btn>
      </div>
    </div>
  )
}
