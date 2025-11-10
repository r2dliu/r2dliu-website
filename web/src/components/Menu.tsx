import EmailIcon from '@mui/icons-material/Email'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import TwitterIcon from '@mui/icons-material/Twitter'
import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export default function Menu() {
  const [LazyLoadImage, setLazyLoadImage] = useState<any>(null)
  const routerState = useRouterState()
  const currPage = routerState.location.pathname.split('/')[1]

  useEffect(() => {
    // Dynamic import to avoid SSR require errors
    import('react-lazy-load-image-component').then((pkg) => {
      setLazyLoadImage(() => pkg.LazyLoadImage)
    })
  }, [])

  const pages = {
    about: 'About Me',
    experience: 'Experience',
    articles: 'Articles',
    melee: 'Melee',
    climbing: 'Climbing',
  }

  if (!LazyLoadImage) {
    return
  }

  return (
    <div className="flex flex-col items-center h-[90%] max-w-xs min-w-xs">
      <Link to="/" className="pb-6">
        <LazyLoadImage
          className="w-[170px] h-[163px] object-contain"
          alt="Square seal script logo for this website"
          src="https://s3.r2dliu.com/assets/logo.png"
          effect="blur"
        />
      </Link>

      <div className="flex flex-col font-['HelveticaNeueBold'] text-3xl uppercase">
        {Object.entries(pages).map(([key, page]) => {
          const isActive = key === currPage
          return (
            <div key={key} className="flex items-center pt-[18px]">
              {isActive ? (
                <PlayArrowIcon className="-ml-8 text-3xl text-white" />
              ) : null}
              <Link
                to={`/${key}` as any}
                className="text-white no-underline hover:underline"
              >
                {page}
              </Link>
            </div>
          )
        })}
        <div className="flex items-center pt-[18px]">
          <a
            href="https://s3.r2dliu.com/assets/resume.pdf"
            className="text-white no-underline hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Resume
          </a>
        </div>
      </div>

      <div className="flex pt-9">
        <a
          href="https://www.linkedin.com/in/r2dliu/"
          target="_blank"
          rel="noreferrer"
          className="pr-3 text-white"
        >
          <LinkedInIcon className="w-10 h-10" />
        </a>
        <a
          href="https://instagram.com/r2dliu"
          target="_blank"
          rel="noreferrer"
          className="pr-3 text-white"
        >
          <InstagramIcon className="w-10 h-10" />
        </a>
        <a href="mailto:zliu3301@gmail.com" className="pr-3 text-white">
          <EmailIcon className="w-10 h-10" />
        </a>
        <a
          href="https://twitter.com/r2_dliu"
          target="_blank"
          rel="noreferrer"
          className="text-white"
        >
          <TwitterIcon className="w-10 h-10" />
        </a>
      </div>
    </div>
  )
}
