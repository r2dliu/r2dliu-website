import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/stacker')({
  component: Stacker,
  head: () => ({
    meta: [
      {
        title: 'Stacker',
      },
      {
        property: 'og:title',
        content: 'Stacker',
      },
      {
        name: 'description',
        content: 'Interactive 3D stacker game built with React Three Fiber.',
      },
    ],
  }),
})

function Stacker() {
  const [StackerGame, setStackerGame] = useState<any>(null)

  useEffect(() => {
    // Dynamic import to avoid SSR issues with Three.js
    import('../components/stacker/StackerGame').then((module) => {
      setStackerGame(() => module.StackerGame)
    })
  }, [])

  if (!StackerGame) {
    return <div className="h-full w-full bg-white" />
  }

  return <StackerGame />
}
