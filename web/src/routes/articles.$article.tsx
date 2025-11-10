import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { Divider } from '@mui/material'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import tocbot from 'tocbot'

import { articleData } from '../data/articles'

const generateSlug = (str: string) => {
  str = str.replace(/^\s+|\s+$/g, '')
  str = str.toLowerCase()
  const from = 'àáãäâèéëêìíïîòóöôùúüûñç·/_,:;'
  const to = 'aaaaaeeeeiiiioooouuuunc------'

  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  return str
}

export const Route = createFileRoute('/articles/$article')({
  component: Article,
  loader: ({ params }: { params: { article: string } }) => {
    const data = articleData[params.article as keyof typeof articleData] as
      | (typeof articleData)[keyof typeof articleData]
      | undefined

    if (!data) {
      throw notFound()
    }

    return data
  },
  head: (ctx) => {
    const loaderData = ctx.loaderData
    if (!loaderData) return { meta: [] }
    return {
      meta: [
        {
          title: loaderData.title,
        },
        {
          property: 'og:title',
          content: loaderData.title,
        },
        {
          name: 'description',
          content: loaderData.description,
        },
        {
          property: 'og:image',
          content: loaderData.image,
        },
      ],
    }
  },
})

function Article() {
  const [LazyLoadImage, setLazyLoadImage] = useState<any>(null)
  const data = Route.useLoaderData()
  const lastData = useRef(data)
  const articleRef = useRef<HTMLDivElement>(null)
  const tocRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Dynamic import to avoid SSR require errors
    import('react-lazy-load-image-component').then((pkg) => {
      setLazyLoadImage(() => pkg.LazyLoadImage)
    })
  }, [])

  useEffect(() => {
    lastData.current = data
  }, [data])

  useEffect(() => {
    if (!articleRef.current || !tocRef.current) {
      return
    }

    tocbot.init({
      tocSelector: '.toc',
      contentSelector: '.article',
      headingSelector: 'h1, h2',
      hasInnerContainers: true,
      scrollContainer: '.markdown-container',
      onClick: async () => {
        await new Promise((r) => setTimeout(r, 50))
        tocbot.refresh()
      },
      headingsOffset: 90,
      scrollSmooth: true,
      scrollSmoothDuration: 420,
    })

    return () => {
      tocbot.destroy()
    }
  }, [data, LazyLoadImage])

  if (!LazyLoadImage) {
    return
  }

  return (
    <div className="flex flex-row-reverse h-full">
      {/* Main Content */}
      <div className="flex flex-col w-[calc(100%-300px)] max-lg:w-full relative">
        <span className="article-title z-10 bg-black px-2.5 py-2 left-[10%] max-lg:left-10 absolute top-0 text-5xl max-lg:text-4xl font-['BebasNeue'] w-fit">
          {data.title}
        </span>

        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.4, ease: 'easeIn', delay: 0.15 }}
          className="absolute h-16 max-lg:h-13 top-0 left-0 right-0 flex items-center pointer-events-none"
        >
          <Divider className="!h-0.5 !w-full !bg-white" />
        </motion.div>

        <div className="markdown-container overflow-y-auto pr-3 pl-3 overflow-x-hidden">
          <div className="article" ref={articleRef}>
            <Markdown
              components={{
                h1: ({ ...props }) => (
                  <h1 id={generateSlug(props.children as string)} {...props} />
                ),
                h2: ({ ...props }) => (
                  <h2 id={generateSlug(props.children as string)} {...props} />
                ),
                img: ({ ...props }) => (
                  <LazyLoadImage effect="blur" {...props} />
                ),
              }}
              rehypePlugins={[rehypeRaw]}
            >
              {data.markdown}
            </Markdown>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex flex-col items-center justify-between w-[300px] mt-[60px] max-lg:hidden">
        <div className="w-[224px] pr-4 border-2 border-white p-4">
          <div className="toc" ref={tocRef} />
        </div>

        <Link to="/articles" className="no-underline self-start w-auto">
          <div className="flex flex-col justify-center items-start text-black w-auto">
            <div className="bg-white px-1 py-2.5 mb-0.5 font-['HelveticaNeueMedium']">
              ← Back to Articles
            </div>
            <div className="h-0.5 bg-white w-full" />
          </div>
        </Link>
      </div>
    </div>
  )
}
