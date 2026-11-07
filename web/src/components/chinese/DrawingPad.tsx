import cn from 'classnames'
import { useState } from 'react'

import { useT } from '../../helpers/chinese/i18n'
import { HanziCanvas } from './HanziCanvas'
import { Btn, NO_SELECT, noSelectWhileDrawing } from './ui'

/**
 * Draw a character stroke by stroke. "Show strokes" plays the stroke order
 * as the answer; going back to drawing starts a fresh attempt.
 */
export function DrawingPad({
  hanzi,
  size = 260,
  showOutline = true,
  onComplete,
  onMistake,
}: {
  hanzi: string
  size?: number
  showOutline?: boolean
  onComplete?: (totalMistakes: number) => void
  onMistake?: (totalMistakes: number) => void
}) {
  const t = useT()
  const [showing, setShowing] = useState(false)
  const [attempt, setAttempt] = useState(0)

  const restart = () => {
    setShowing(false)
    setAttempt((a) => a + 1)
    onMistake?.(0)
  }

  return (
    <div className={cn('flex flex-col items-center gap-3', NO_SELECT)}>
      <div {...noSelectWhileDrawing()}>
        <HanziCanvas
          key={`${hanzi}-${attempt}-${showing}`}
          hanzi={hanzi}
          mode={showing ? 'animate' : 'quiz'}
          size={size}
          showOutline={showOutline}
          onQuizMistake={onMistake}
          onQuizComplete={onComplete}
        />
      </div>
      <div className="flex gap-2">
        {showing ? (
          <Btn variant="text" onClick={restart}>
            {t('backToDrawing')}
          </Btn>
        ) : (
          <>
            <Btn variant="text" onClick={() => setShowing(true)}>
              {t('showStrokes')}
            </Btn>
            <Btn variant="text" onClick={restart}>
              {t('startOver')}
            </Btn>
          </>
        )}
      </div>
    </div>
  )
}
