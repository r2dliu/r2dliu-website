import { createFileRoute, Link } from '@tanstack/react-router'
import { Chip, Divider } from '@mui/material'
import * as pkg from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

const { LazyLoadImage } = pkg

export const Route = createFileRoute('/_canvas/articles')({
  component: Articles,
  head: () => ({
    meta: [
      {
        title: 'Articles',
      },
      {
        property: 'og:title',
        content: 'Articles',
      },
      {
        name: 'description',
        content: 'Articles and writeups by David Liu on climbing, gaming, and more.',
      },
    ],
  }),
})

function Articles() {
  return (
    <div className="flex flex-col h-full w-full px-6 overflow-y-auto overflow-x-hidden">
      {/* Featured Article */}
      <Link to="/articles/pulley" className="no-underline text-white">
        <div className="relative flex items-end w-full min-h-[500px] max-h-[500px] max-md:min-h-[300px] max-md:max-h-[300px] max-md:pb-2">
          <div className="m-3 ml-0 pr-2 max-w-[450px] max-md:m-0 z-10">
            <div className="font-['HelveticaNeueBold'] text-[22px] mb-0.5 max-md:text-base max-md:line-clamp-2">
              Pulley Injuries: Literature Review and Personal Rehab Story
            </div>
            <div className="font-['HelveticaNeueRegular'] text-base text-gray-400 line-clamp-3 max-md:text-xs max-md:line-clamp-2">
              Start to finish writeup on the entire process of fully rupturing
              an A4 pulley, reviewing a few decades of sparse research on the
              subject, and rehabbing it to full strength
            </div>
            <div className="flex items-center pt-1">
              <div className="font-['HelveticaNeueRegular'] text-sm text-white max-md:text-xs">
                Dec 29th, 2021
              </div>
              <div className="px-1 text-white text-sm max-md:text-xs">{'•'}</div>
              <Chip
                className="!bg-blue-700 !text-white !font-['HelveticaNeueRegular'] !h-5 max-md:!h-3.5"
                classes={{ label: 'max-md:!px-1' }}
                label="Climbing"
              />
            </div>
          </div>
          <div className="absolute left-0 bottom-0 h-full w-full -z-10 overflow-hidden after:content-[''] after:block after:h-full after:absolute after:top-0 after:w-full after:bg-gradient-to-r after:from-black after:via-black/70 after:via-50% after:to-transparent">
            <LazyLoadImage
              wrapperClassName="w-full h-full"
              className="w-full h-full object-cover -z-20 opacity-100"
              alt="Picture of David in a background filled with neon lights"
              effect="blur"
              src="https://s3.r2dliu.com/assets/articles/pulley/background.jpg"
              placeholderSrc="https://s3.r2dliu.com/assets/articles/pulley/background_small.jpg"
            />
          </div>
        </div>
      </Link>

      <Divider className="!mt-3 !border-gray-400" />

      {/* Article List */}
      <div className="flex">
        <div className="flex flex-col">
          <Link to="/articles/ledgedash" className="no-underline text-white">
            <div className="flex justify-between pt-2 pb-2 border-b border-gray-400 items-center max-w-[700px]">
              <div className="m-3 ml-0 pr-2 max-md:m-0">
                <div className="font-['HelveticaNeueBold'] text-[22px] mb-0.5 max-md:text-base max-md:line-clamp-2">
                  PODE & Ledgedashing
                </div>
                <div className="font-['HelveticaNeueRegular'] text-base text-gray-400 line-clamp-3 max-md:text-xs max-md:line-clamp-2">
                  In-depth summary of the mechanics of PODE and how it affects
                  ledgedashing. Highlights both theoretical and practical
                  considerations for optimal execution
                </div>
                <div className="flex items-center pt-1">
                  <div className="font-['HelveticaNeueRegular'] text-sm text-white max-md:text-xs">
                    Apr 16th, 2018
                  </div>
                  <div className="px-1 text-white text-sm max-md:text-xs">{'•'}</div>
                  <Chip
                    className="!bg-red-700 !text-white !font-['HelveticaNeueRegular'] !h-5 max-md:!h-3.5"
                    classes={{ label: 'max-md:!px-1' }}
                    label="Melee"
                  />
                </div>
              </div>
              <div className="min-w-[200px] max-w-[200px] h-[150px] max-md:min-w-[100px] max-md:max-w-[100px] max-md:h-[100px] flex justify-center items-center overflow-hidden">
                <LazyLoadImage
                  className="w-full"
                  alt="Blurry camera photo of Fox in Super Smash Bros. Melee performing an intangible nair after a ledgedash"
                  effect="blur"
                  src="https://s3.r2dliu.com/assets/articles/ledgedash/background.jpg"
                  placeholderSrc="https://s3.r2dliu.com/assets/articles/ledgedash/background_small.jpg"
                />
              </div>
            </div>
          </Link>

          <Link to="/articles/autocancel" className="no-underline text-white">
            <div className="flex justify-between pt-2 pb-2 border-b border-gray-400 items-center max-w-[700px]">
              <div className="m-3 ml-0 pr-2 max-md:m-0">
                <div className="font-['HelveticaNeueBold'] text-[22px] mb-0.5 max-md:text-base max-md:line-clamp-2">
                  Fox Autocancel Aerials
                </div>
                <div className="font-['HelveticaNeueRegular'] text-base text-gray-400 line-clamp-3 max-md:text-xs max-md:line-clamp-2">
                  Small piece on niche but practical situations for Fox's
                  underutilized autocancel options
                </div>
                <div className="flex items-center pt-1">
                  <div className="font-['HelveticaNeueRegular'] text-sm text-white max-md:text-xs">
                    Sep 13th, 2019
                  </div>
                  <div className="px-1 text-white text-sm max-md:text-xs">{'•'}</div>
                  <Chip
                    className="!bg-red-700 !text-white !font-['HelveticaNeueRegular'] !h-5 max-md:!h-3.5"
                    classes={{ label: 'max-md:!px-1' }}
                    label="Melee"
                  />
                </div>
              </div>
              <div className="min-w-[200px] max-w-[200px] h-[150px] max-md:min-w-[100px] max-md:max-w-[100px] max-md:h-[100px] flex justify-center items-center overflow-hidden">
                <LazyLoadImage
                  className="w-full"
                  alt="Image displaying all of Fox's aerials in Super Smash Bros. Melee"
                  effect="blur"
                  src="https://s3.r2dliu.com/assets/articles/autocancel/background.jpg"
                  placeholderSrc="https://s3.r2dliu.com/assets/articles/autocancel/background_small.jpg"
                />
              </div>
            </div>
          </Link>

          <a
            href="https://s3.r2dliu.com/assets/articles/kirigami/kirigami.pdf"
            target="_blank"
            rel="noreferrer"
            className="no-underline text-white"
          >
            <div className="flex justify-between pt-2 pb-2 border-b border-gray-400 items-center max-w-[700px]">
              <div className="m-3 ml-0 pr-2 max-md:m-0">
                <div className="font-['HelveticaNeueBold'] text-[22px] mb-0.5 max-md:text-base max-md:line-clamp-2">
                  Kirigami
                </div>
                <div className="font-['HelveticaNeueRegular'] text-base text-gray-400 line-clamp-3 max-md:text-xs max-md:line-clamp-2">
                  Short paper written in undergrad for a Topics in Geometry
                  class exploring some mathematical concepts in kirigami
                </div>
                <div className="flex items-center pt-1">
                  <div className="font-['HelveticaNeueRegular'] text-sm text-white max-md:text-xs">
                    Dec, 2017
                  </div>
                  <div className="px-1 text-white text-sm max-md:text-xs">{'•'}</div>
                  <Chip
                    className="!bg-green-700 !text-white !font-['HelveticaNeueRegular'] !h-5 max-md:!h-3.5"
                    classes={{ label: 'max-md:!px-1' }}
                    label="Math"
                  />
                </div>
              </div>
              <div className="min-w-[200px] max-w-[200px] h-[150px] max-md:min-w-[100px] max-md:max-w-[100px] max-md:h-[100px] flex justify-center items-center overflow-hidden">
                <LazyLoadImage
                  className="w-full"
                  alt="Diagram of the Gauss map and its relation to curvature"
                  effect="blur"
                  src="https://s3.r2dliu.com/assets/articles/kirigami/background.jpg"
                  placeholderSrc="https://s3.r2dliu.com/assets/articles/nim/background_small.jpg"
                />
              </div>
            </div>
          </a>

          <a
            href="https://s3.r2dliu.com/assets/articles/nim/nim.pdf"
            target="_blank"
            rel="noreferrer"
            className="no-underline text-white"
          >
            <div className="flex justify-between pt-2 pb-2 border-b border-gray-400 items-center max-w-[700px]">
              <div className="m-3 ml-0 pr-2 max-md:m-0">
                <div className="font-['HelveticaNeueBold'] text-[22px] mb-0.5 max-md:text-base max-md:line-clamp-2">
                  On the Game of Nim
                </div>
                <div className="font-['HelveticaNeueRegular'] text-base text-gray-400 line-clamp-3 max-md:text-xs max-md:line-clamp-2">
                  Short discrete math paper written in undergrad exploring the
                  game of Nim
                </div>
                <div className="flex items-center pt-1">
                  <div className="font-['HelveticaNeueRegular'] text-sm text-white max-md:text-xs">
                    Dec, 2015
                  </div>
                  <div className="px-1 text-white text-sm max-md:text-xs">{'•'}</div>
                  <Chip
                    className="!bg-green-700 !text-white !font-['HelveticaNeueRegular'] !h-5 max-md:!h-3.5"
                    classes={{ label: 'max-md:!px-1' }}
                    label="Math"
                  />
                </div>
              </div>
              <div className="min-w-[200px] max-w-[200px] h-[150px] max-md:min-w-[100px] max-md:max-w-[100px] max-md:h-[100px] flex justify-center items-center overflow-hidden">
                <LazyLoadImage
                  className="w-full"
                  alt="Line graph displaying paths between points with specific Nim values"
                  effect="blur"
                  src="https://s3.r2dliu.com/assets/articles/nim/background.jpg"
                  placeholderSrc="https://s3.r2dliu.com/assets/articles/nim/background_small.jpg"
                />
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
