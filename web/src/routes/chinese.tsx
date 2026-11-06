import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/chinese')({
  component: Chinese,
  head: () => ({
    meta: [
      {
        title: 'Chinese Flashcards',
      },
      {
        property: 'og:title',
        content: 'Chinese Flashcards',
      },
      {
        name: 'description',
        content:
          'Spaced-repetition Chinese flashcards with stroke-order drawing and related vocab.',
      },
    ],
  }),
})

function Chinese() {
  const [Flashcards, setFlashcards] = useState<any>(null)

  useEffect(() => {
    // Client-only: uses localStorage and the Hanzi Writer DOM APIs
    import('../components/chinese/ChineseFlashcards').then((module) => {
      setFlashcards(() => module.ChineseFlashcards)
    })
  }, [])

  if (!Flashcards) {
    return <div className="h-full w-full" />
  }

  return <Flashcards />
}
