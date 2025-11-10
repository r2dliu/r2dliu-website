import { createFileRoute } from '@tanstack/react-router'
import { Divider } from '@mui/material'
import cn from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export const Route = createFileRoute('/_canvas/experience')({
  component: Experience,
  head: () => ({
    meta: [
      {
        title: 'Experience',
      },
      {
        property: 'og:title',
        content: 'Experience',
      },
      {
        name: 'description',
        content: 'Work experience and skills of David Liu, software engineer.',
      },
    ],
  }),
})

type entriesType = Record<
  string,
  {
    name: string
    title: string
    range: string
    description: Array<ReactNode>
  }
>

function Experience() {
  const entries: entriesType = {
    'Axle Informatics': {
      name: 'Axle Informatics',
      title: 'Software Engineer',
      range: '2024 - Present',
      description: [
        <br key={1} />,
        <a
          key={'link'}
          href="https://www.axleinfo.com/"
          target="_blank"
          rel="noreferrer"
        >
          Axle Informatics
        </a>,
        ' is a bioinformatics and health data science company that partners with federal agencies and research institutions to advance scientific discovery and public health initiatives.',
        <br key={2} />,
        <br key={3} />,
        'I primarily run two main projects, one where I build a Photoshop-like tool for visualizing, analyzing, and manipulating multi-terabyte 3D light microscopy datasets, and a second where I construct a library that permits arbitrary transformations on structured data, extremely useful for manipulating messy EHR data and translating between standards.',
      ],
    },
    ThinkNimble: {
      name: 'ThinkNimble',
      title: 'Software Engineer / Project Lead',
      range: '2023 - 2024',
      description: [
        <br key={1} />,
        <a
          key={'link'}
          href="https://www.thinknimble.com/"
          target="_blank"
          rel="noreferrer"
        >
          ThinkNimble
        </a>,
        ' is a startup-oriented software development agency, but with a twist: they build businesses from the ground up. Rather than just coding the product, they also coach founders through strategy, help them hire their staff, advise them through launch, and guide them through the startup process with decades of collective knowledge amongst its staff.',
        <br key={2} />,
        <br key={3} />,
        "As a software engineer and project lead, I work directly with clients throughout the process of turning their ideas into reality, typically from scratch or bootstrapped with ThinkNimble's internal tooling. This involves a large variety of fields and expertise, such as medicine, the judicial system, political lobbying, education, finance, machine learning, etc.",
      ],
    },
    'JHU/APL': {
      name: 'JHU Applied Physics Laboratory',
      title: 'Software Architect',
      range: '2019 — 2023',
      description: [
        <br key={1} />,
        'At ',
        <a
          key={'link'}
          href="https://www.jhuapl.edu/"
          target="_blank"
          rel="noreferrer"
        >
          APL
        </a>,
        ', I worked primarily as a software architect, while also taking on the roles of a full stack dev, team lead, mentor, and project manager.',
        <br key={2} />,
        <br key={3} />,
        'I was the foremost software developer on a Joint Artificial Intelligence Center (JAIC)/Chief Digital and Artificial Intelligence Office (CDAO) project called Smart Sensor. This awarded a hefty contract ranging well into the eight-figure range to enable the operation of autonomous unmanned aerial vehicles. The project involved real-time sensor processing and data fusion (electro-optical/infrared systems, passive electronic sensing, synthetic aperture radar, etc.). I managed a core team of 10-20 developers and served as the primary engineering point of contact for the other teams such as algorithm developers and AI/ML researchers, totalling more than 100 people. I integrated their work into the final product, implemented algorithms, deployed machine learning models, specced hardware, built microservices, managed unit tests and CI/CD flows, and wrote lots and lots of code.',
        <br key={4} />,
        <br key={5} />,
        'I was also a core full-stack developer on a multimillion dollar project called ORCA, or the Office of Naval Intelligence (ONI) Repository of Characterized Adversaries. This involved transitioning a large body of hierarchical data such that it could be securely accessible from the cloud via a modernized web app. Much of the difficulty of this lay in the complexity and sensitivity of the data and desire to enable actions such as search, filter, manage permissions, detect anomalies, etc.',
      ],
    },
    'Start.gg': {
      name: 'Start.gg',
      title: 'Software Engineer',
      range: '2018 — 2019',
      description: [
        <br key={1} />,
        'I worked as a full-stack software engineer at ',
        <a
          key={'link'}
          href="https://start.gg/"
          target="_blank"
          rel="noreferrer"
        >
          Start.gg
        </a>,
        ', formerly known as Smash.gg prior to its acquisition by Microsoft. Start.gg is a esports platform designed to support and facilitate esports events. This focuses particularly on capabilities revolving around competition, such as constructing tournament brackets, reporting live results, alerting users of matches, providing admin and moderation tools, managing series and leagues, and driving the growth of passionate organizers around the world.',
        <br key={2} />,
        <br key={3} />,
        'During my time as part of a small, fast-paced team, I wore many hats, working on nearly every aspect of the codebase. I designed features, wrote both frontend and backend code, managed databases, supported DevOps, and interfaced with partners such as Twitch and Microsoft on a variety of projects.',
      ],
    },
    'Johns Hopkins University': {
      name: 'Johns Hopkins University',
      title: 'M.S. in Computer Science',
      range: '2021 — 2023',
      description: [
        <br key={1} />,
        'Mostly done part time (2-3 classes per semester) while working full time at APL.',
      ],
    },
    'Swarthmore College': {
      name: 'Swarthmore College',
      title: 'B.S. in Computer Science',
      range: '2014 — 2018',
      description: [<br key={1} />, 'Additional minor in mathematics.'],
    },
  }

  const [activeEntry, setActiveEntry] = useState('Axle Informatics')
  const [timelineHeight, setTimelineHeight] = useState(0)
  const [timelineTop, setTimelineTop] = useState(0)
  const entriesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (entriesRef.current) {
      const children = Array.from(
        entriesRef.current.children,
      ) as Array<HTMLElement>
      const firstDiamond = children[0].querySelector(
        'div:first-child',
      ) as HTMLElement
      const lastDiamond = children[children.length - 1].querySelector(
        'div:first-child',
      ) as HTMLElement

      // Get the vertical positions of the diamonds
      const containerRect = entriesRef.current.getBoundingClientRect()
      const firstRect = firstDiamond.getBoundingClientRect()
      const lastRect = lastDiamond.getBoundingClientRect()

      // Calculate top offset from container to center of first diamond
      const firstCenter = firstRect.top + firstRect.height / 2
      const lastCenter = lastRect.top + lastRect.height / 2

      setTimelineTop(firstCenter - containerRect.top)
      setTimelineHeight(lastCenter - firstCenter)
    }
  }, [])

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col p-4 md:p-12">
        {/* Work & Experience Section */}
        <div className="flex flex-col">
        <div className="font-['HelveticaNeueBold'] text-3xl pb-4">
          Work & Experience
        </div>
        <div className="relative flex">
          {/* Timeline */}
          <Divider
            orientation="vertical"
            className="!absolute !border-none !bg-gray-400 !w-px left-2 max-md:left-3 -z-10"
            style={{
              top: `${timelineTop}px`,
              height: `${timelineHeight}px`,
            }}
          />

          {/* Entries */}
          <div ref={entriesRef} className="w-36">
            {Object.keys(entries).map((entry, index) => (
              <div
                key={entry}
                className={cn(
                  'cursor-pointer flex items-center text-gray-400 max-md:pl-1 transition-all duration-150 ease-in hover:text-white',
                  {
                    'text-white': entry === activeEntry,
                    'h-20 mb-4': index !== Object.keys(entries).length - 1,
                    'h-20': index === Object.keys(entries).length - 1,
                  },
                )}
                onClick={() => {
                  setActiveEntry(entry)
                }}
              >
                <div
                  className={cn(
                    'min-h-4 min-w-4 rotate-45 bg-gray-400 transition-all duration-150 ease-in flex-shrink-0',
                    {
                      'bg-white': entry === activeEntry,
                    },
                  )}
                />
                <div className="pl-2 font-['HelveticaNeueMedium'] text-lg break-words">
                  {entry}
                </div>
              </div>
            ))}
          </div>

          {/* Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEntry}
              className="flex-1 pl-6 max-md:pl-2 pr-2"
              initial={{ y: '-5px', opacity: 0 }}
              animate={{ y: '0', opacity: 1 }}
              exit={{
                y: '5px',
                opacity: 0,
                transition: {
                  duration: 0.15,
                  ease: 'easeOut',
                },
              }}
              transition={{ duration: 0.15, ease: 'easeIn' }}
            >
              <div className="font-['HelveticaNeueMedium'] text-2xl">
                {entries[activeEntry].name}
              </div>
              <div className="font-['HelveticaNeueRegular'] text-base text-gray-400">
                {entries[activeEntry].title}
              </div>
              <div className="font-['HelveticaNeueRegular'] text-base text-gray-400">
                {entries[activeEntry].range}
              </div>
              <div className="font-['HelveticaNeueRegular'] text-base">
                {entries[activeEntry].description}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

        {/* Skills & Languages Section */}
        <div className="flex-shrink-0 max-md:pb-0">
          <div className="font-['HelveticaNeueBold'] text-3xl py-4">
            Skills & Languages
          </div>
          <div className="font-['HelveticaNeueRegular'] text-base">
            C++ (mostly 17, 20) • Javascript (mostly ES6+) • Rust • Python • React
            / React Native / Vue • Linux • GraphQL • CI/CD • Docker • SQL • Node •
            Git • Machine Learning • AWS • Figma • Photoshop
          </div>
        </div>
      </div>
    </div>
  )
}
