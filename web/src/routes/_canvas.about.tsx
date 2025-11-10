import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import 'react-lazy-load-image-component/src/effects/blur.css'

export const Route = createFileRoute('/_canvas/about')({
  component: About,
  head: () => ({
    meta: [
      {
        title: 'About Me',
      },
      {
        property: 'og:title',
        content: 'About Me',
      },
      {
        name: 'description',
        content: "I'm David, a full-stack software engineer.",
      },
    ],
  }),
})

function About() {
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
    <div className="relative h-full w-full overflow-hidden flex items-center justify-center">
      <div className="h-full absolute inset-0 z-0 flex items-center justify-center">
        <div className="opacity-50 h-full max-w-full image-wrapper relative overflow-hidden">
          <LazyLoadImage
            className="h-full w-auto max-w-full origin-center object-contain"
            wrapperClassName="h-full max-w-full origin-center"
            style={{ height: '100%', width: 'auto', maxWidth: '100%', transform: 'scale(1.5)' }}
            alt="Picture of David in a background filled with neon lights"
            effect="blur"
            src="https://s3.r2dliu.com/assets/about.jpg"
            placeholderSrc="https://s3.r2dliu.com/assets/about_small.jpg"
          />
        </div>
      </div>

      <div className="relative h-full w-full p-4 pb-1 md:p-16 overflow-y-auto z-10">
        <div className="flex flex-col min-h-full items-center justify-between">
          <div className="flex flex-col w-full">
            <div className="font-['HelveticaNeueBold'] text-6xl pb-8">
            I'm David, a full-stack software engineer.
            </div>
            <div className="font-['HelveticaNeue'] text-xl w-full break-words">
              <p>
                I'm also a climber, hacker, Melee player, coach, fashion enthusiast,
                and much more.
              </p>
              <p>
                I'm obsessed with the concept of self improvement and pushing the
                limits of what I'm capable of. In the process, I've grown into a
                passionate, disciplined, and process-oriented architect who sees work
                and play as two sides of the same coin.
              </p>
              <p>
                This site is currently having a bit of an identity crisis: it's
                simultaneously a passion project, a testbed, a portfolio, and a
                conglomerate of various types of content. This is also the fourth time
                I've rebuilt it from scratch. That being said, it is my website, so I
                think it's okay if it grows into a bit of a hodgepodge collection of
                my many interests.
              </p>
              <p>Thanks for visiting and checking out my site!</p>
            </div>
          </div>

          <div className="font-['HelveticaNeueThin'] text-gray-400 text-sm mt-2.5 self-end">
            Photo by Bekah Wong |{' '}
            <a href="https://twitter.com/alonelychime">
              @alonelychime
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
