import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import 'react-lazy-load-image-component/src/effects/blur.css'

export const Route = createFileRoute('/_canvas/melee')({
  component: Melee,
  head: () => ({
    meta: [
      {
        title: 'Melee',
      },
      {
        property: 'og:title',
        content: 'Melee',
      },
      {
        name: 'description',
        content: 'R2DLiu - Super Smash Bros. Melee competitor and Fox main.',
      },
    ],
  }),
})

function Melee() {
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
    <div className="h-full w-full overflow-y-auto overflow-x-hidden relative">
      <LazyLoadImage
        wrapperClassName="opacity-100 h-full right-0 absolute -z-10 overflow-hidden max-[1400px]:hidden after:content-[''] after:block after:h-full after:absolute after:top-0 after:w-full after:bg-gradient-to-r after:from-black after:from-0% after:via-black/60 after:via-40% after:via-black/30 after:via-70% after:to-transparent"
        className="-z-20 relative h-full w-auto min-w-full object-cover"
        alt="Picture of David with a Gamecube controller in pocket"
        effect="blur"
        src="https://s3.r2dliu.com/assets/melee.jpg"
        placeholderSrc="https://s3.r2dliu.com/assets/melee_small.jpg"
      />
      <div className="font-['HelveticaNeueThin'] text-gray-400 text-sm absolute right-4 bottom-1 max-[1400px]:hidden z-10">
        Photo by Lilian Chen |{' '}
        <a className="no-underline" href="https://twitter.com/_lilchen">
          @_lilchen
        </a>
      </div>

      <div className="flex flex-col p-4 md:p-6 relative">
      <div className="font-['HelveticaNeueRegular'] text-gray-400 text-sm">
        Super Smash Bros. Melee • Fox
      </div>
      <div className="font-['BebasNeue'] text-8xl mt-0">EGTV. R2DLiu</div>

      <div className="font-['HelveticaNeueRegular'] text-base pb-2 max-w-full w-96 relative pt-2">
        After picking up the game competitively back in late 2014, David
        "R2DLiu" Liu quickly rose to prominence, consolidating a spot as a top
        player within the greater Philadelphia region. In October 2016, with a
        slew of top 100 wins under his belt, he achieved his best result yet at
        the Big House 6: an incredible upset over a perennial top 10 player, the
        indomitable Pikachu master{' '}
        <a href="https://en.wikipedia.org/wiki/Axe_(gamer)">Axe</a>.
        <div className="absolute left-96 -top-24 max-[1400px]:hidden">
          <LazyLoadImage
            className="h-64 w-auto max-w-none"
            alt="Picture of Fox from Super Smash Bros. Melee performing a down-aerial"
            effect="blur"
            src="https://s3.r2dliu.com/assets/fox_drill.png"
            placeholderSrc="https://s3.r2dliu.com/assets/fox_drill_small.png"
          />
        </div>
      </div>

      <div className="font-['HelveticaNeueRegular'] text-base pb-4 max-w-3xl max-lg:max-w-sm">
        Since then, R2DLiu has continued to compete on and off throughout the
        years, fading slowly into inactivity, but continuing to remain a threat
        in bracket at majors. Most recently, he achieved a top 64 finish at
        Genesis 9 after a nearly three year hiatus. Follow him along on his
        enduring Melee journey on <a href="https://twitch.tv/r2dliu">Twitch</a>{' '}
        and <a href="https://twitter.com/r2_dliu">Twitter</a>.
      </div>

      <div className="font-['HelveticaNeueMedium'] text-3xl pb-4">
        Achievements
      </div>
      <div className="flex pb-6">
        <div className="flex flex-col justify-center items-center w-44 max-lg:flex-grow max-lg:w-auto">
          <div className="font-['HelveticaNeueRegular'] text-base pb-3">
            The Big House 6
          </div>
          <div className="relative flex justify-center items-center h-30 w-30 max-md:h-25 max-md:w-25 rounded-full bg-white/5 border-2 border-gray-400">
            <div className="text-4xl max-md:text-3xl">
              <span className="font-['HelveticaNeueBold']">33</span>
              <span className="font-['HelveticaNeueLight']">rd</span>
            </div>
            <div className="absolute w-30 h-30 max-md:h-25 max-md:w-25 rounded-full bg-transparent">
              <div className="overflow-hidden absolute -top-4 right-1/2 bottom-1/2 -left-4 origin-bottom-right rotate-0 skew-x-[36deg] before:content-[''] before:box-border before:block before:border-2 before:border-gray-400 before:w-[200%] before:h-[200%] before:rounded-full before:-skew-x-[36deg]" />
            </div>
            <div className="absolute w-30 h-30 max-md:h-25 max-md:w-25 rounded-full bg-transparent">
              <div className="overflow-hidden absolute -top-4 right-1/2 bottom-1/2 -left-4 origin-bottom-right rotate-180 skew-x-[36deg] before:content-[''] before:box-border before:block before:border-2 before:border-gray-400 before:w-[200%] before:h-[200%] before:rounded-full before:-skew-x-[36deg]" />
            </div>
          </div>
          <div className="font-['HelveticaNeueRegular'] text-base pt-3">
            <span className="text-gray-400">out of </span>
            <span>1564</span>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center w-44 max-lg:flex-grow max-lg:w-auto">
          <div className="font-['HelveticaNeueRegular'] text-base pb-3">
            Genesis 4
          </div>
          <div className="relative flex justify-center items-center h-30 w-30 max-md:h-25 max-md:w-25 rounded-full bg-white/5 border-2 border-gray-400">
            <div className="text-4xl max-md:text-3xl">
              <span className="font-['HelveticaNeueBold']">49</span>
              <span className="font-['HelveticaNeueLight']">th</span>
            </div>
            <div className="absolute w-30 h-30 max-md:h-25 max-md:w-25 rounded-full bg-transparent">
              <div className="overflow-hidden absolute -top-4 right-1/2 bottom-1/2 -left-4 origin-bottom-right rotate-0 skew-x-[36deg] before:content-[''] before:box-border before:block before:border-2 before:border-gray-400 before:w-[200%] before:h-[200%] before:rounded-full before:-skew-x-[36deg]" />
            </div>
            <div className="absolute w-30 h-30 max-md:h-25 max-md:w-25 rounded-full bg-transparent">
              <div className="overflow-hidden absolute -top-4 right-1/2 bottom-1/2 -left-4 origin-bottom-right rotate-180 skew-x-[36deg] before:content-[''] before:box-border before:block before:border-2 before:border-gray-400 before:w-[200%] before:h-[200%] before:rounded-full before:-skew-x-[36deg]" />
            </div>
          </div>
          <div className="font-['HelveticaNeueRegular'] text-base pt-3">
            <span className="text-gray-400">out of </span>
            <span>1704</span>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center w-44 max-lg:flex-grow max-lg:w-auto">
          <div className="font-['HelveticaNeueRegular'] text-base pb-3">
            Genesis 9
          </div>
          <div className="relative flex justify-center items-center h-30 w-30 max-md:h-25 max-md:w-25 rounded-full bg-white/5 border-2 border-gray-400">
            <div className="text-4xl max-md:text-3xl">
              <span className="font-['HelveticaNeueBold']">49</span>
              <span className="font-['HelveticaNeueLight']">th</span>
            </div>
            <div className="absolute w-30 h-30 max-md:h-25 max-md:w-25 rounded-full bg-transparent">
              <div className="overflow-hidden absolute -top-4 right-1/2 bottom-1/2 -left-4 origin-bottom-right rotate-0 skew-x-[36deg] before:content-[''] before:box-border before:block before:border-2 before:border-gray-400 before:w-[200%] before:h-[200%] before:rounded-full before:-skew-x-[36deg]" />
            </div>
            <div className="absolute w-30 h-30 max-md:h-25 max-md:w-25 rounded-full bg-transparent">
              <div className="overflow-hidden absolute -top-4 right-1/2 bottom-1/2 -left-4 origin-bottom-right rotate-180 skew-x-[36deg] before:content-[''] before:box-border before:block before:border-2 before:border-gray-400 before:w-[200%] before:h-[200%] before:rounded-full before:-skew-x-[36deg]" />
            </div>
          </div>
          <div className="font-['HelveticaNeueRegular'] text-base pt-3">
            <span className="text-gray-400">out of </span>
            <span>1251</span>
          </div>
        </div>
      </div>

      <div className="font-['HelveticaNeueMedium'] text-3xl pb-4">Gameplay</div>
      <div className="flex flex-wrap max-lg:flex-col">
        <ReactPlayer
          className="max-w-[calc(calc(100%-80px)/3)] max-lg:max-w-full mr-10 max-lg:mr-0 max-lg:mb-5"
          width={300}
          height={200}
          controls={true}
          src="https://www.youtube.com/watch?v=IbImG0x4hD4"
        />
        <ReactPlayer
          className="max-w-[calc(calc(100%-80px)/3)] max-lg:max-w-full mr-10 max-lg:mr-0 max-lg:mb-5"
          width={300}
          height={200}
          controls={true}
          src="https://www.youtube.com/watch?v=q_qxSYaAk7w"
        />
        <ReactPlayer
          className="max-w-[calc(calc(100%-80px)/3)] max-lg:max-w-full"
          width={300}
          height={200}
          controls={true}
          src="https://www.youtube.com/watch?v=Nc8gFTz2irw"
        />
      </div>
      </div>
    </div>
  )
}
