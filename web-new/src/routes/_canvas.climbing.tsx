import { Link, createFileRoute,  } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import 'react-lazy-load-image-component/src/effects/blur.css'

export const Route = createFileRoute('/_canvas/climbing')({
  component: Climbing,
  head: () => ({
    meta: [
      {
        title: 'Climbing',
      },
      {
        property: 'og:title',
        content: 'Climbing',
      },
      {
        name: 'description',
        content: 'Rock climbing athlete, ACSM Certified Personal Trainer, and coach.',
      },
    ],
  }),
})

function Climbing() {
  const [LazyLoadImage, setLazyLoadImage] = useState<any>(null)

  useEffect(() => {
    // Dynamic import to avoid SSR require errors
    import('react-lazy-load-image-component').then((pkg) => {
      setLazyLoadImage(() => pkg.LazyLoadImage)
    })
  }, [])

  if (!LazyLoadImage) {
    return
  }

  return (
    <div className="flex flex-col h-full w-full p-10 max-md:p-4 overflow-y-auto overflow-x-hidden relative">
      <div className="font-['HelveticaNeueBold'] text-5xl max-md:text-3xl pb-4">
        "You will always find an appropriate opponent in the rocks."
      </div>
      <div className="font-['HelveticaNeueLight'] text-2xl self-end pb-4 pr-4">
        — Tomáš "TOMAJDA" Sobotka
      </div>

      <LazyLoadImage
        wrapperClassName="opacity-50 h-full right-0 max-md:right-[-64px] absolute -z-10 overflow-hidden"
        className="-z-20 relative h-full w-auto min-w-full object-cover"
        alt="Picture of David climbing at an indoor competition"
        effect="blur"
        src="https://s3.r2dliu.com/assets/climbing.jpg"
        placeholderSrc="https://s3.r2dliu.com/assets/climbing_small.jpg"
      />

      <div className="max-w-3xl font-['HelveticaNeueLight'] text-xl">
        I discovered rock climbing as a hobby late into my college years, and I've
        been hooked ever since. Recently, I've started to compete, train, and
        generally take climbing much more seriously. I currently boulder around V10
        relatively consistently. Follow me on Instagram for climbing content!
      </div>

      <div className="pt-6 font-['HelveticaNeueMedium'] text-3xl pb-6">
        Personal Training & Coaching
      </div>
      <div className="max-w-3xl font-['HelveticaNeueLight'] text-xl">
        I am an{' '}
        <a href="https://www.acsm.org/" target="_blank" rel="noreferrer">
          ACSM
        </a>{' '}
        Certified Personal Trainer® (ACSM-CPT) who works at{' '}
        <a
          href="https://movementgyms.com/columbia/"
          target="_blank"
          rel="noreferrer"
        >
          Movement Columbia
        </a>
        . Check out my free <Link to="/classes">classes</Link>! I love teaching in
        general and have an extensive history of tutoring and coaching in various
        subjects, including academia, Melee, and of course health and fitness. I
        primarily work with climbing athletes to improve their performance, but am
        happy to help any motivated individual meet their specific goals! Email me
        or message me on{' '}
        <a
          href="https://www.instagram.com/r2dliu/"
          target="_blank"
          rel="noreferrer"
        >
          Instagram
        </a>{' '}
        for information on rates and availability! I work with both remote and
        in-person clients.
      </div>

      <div className="pt-6 font-['HelveticaNeueMedium'] text-3xl pb-6">
        Tick List
      </div>
      <div className="max-w-3xl font-['HelveticaNeueLight'] text-xl pb-4">Soon™</div>

      <div className="instagram-media" data-instgrm-permalink="https://www.instagram.com/r2dliu/?utm_source=ig_embed&utm_campaign=loading" data-instgrm-version="14">
        <script async src="//www.instagram.com/embed.js"></script>
      </div>
    </div>
  )
}
