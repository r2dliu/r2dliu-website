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
  loader: ({ params }) => {
    const data = articleData[params.article as keyof typeof articleData]

    if (!data) {
      throw notFound()
    }

    return data
  },
  head: ({ loaderData }) => {
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

  useEffect(() => {
    // Dynamic import to avoid SSR require errors
    import('react-lazy-load-image-component').then((pkg) => {
      setLazyLoadImage(() => pkg.LazyLoadImage)
    })
  }, [])

  useEffect(() => {
    if (data) {
      lastData.current = data
    }
  }, [data])

  const currentData = data || lastData.current

  useEffect(() => {
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
    })

    return () => {
      tocbot.destroy()
    }
  }, [])

  if (!LazyLoadImage) {
    return <div className="flex flex-col h-full w-full p-6">Loading...</div>
  }

  return (
    <div className="flex flex-row-reverse h-full">
      {/* Sidebar */}
      <div className="flex flex-col items-center justify-between w-[300px] mt-[60px] max-lg:hidden">
        <div className="w-[224px] pr-4 border-2 border-white">
          <div className="toc" />
        </div>

        <Link to="/articles" className="no-underline self-start w-auto">
          <div className="flex justify-center items-center text-black w-auto">
            <div className="bg-white px-1 py-2.5 mb-0.5 font-['HelveticaNeueMedium']">
              ← Back to Articles
            </div>
            <div className="h-0.5 bg-white w-full" />
          </div>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-[calc(100%-300px)] max-lg:w-full relative">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.4, ease: 'easeIn', delay: 0.15 }}
        >
          <Divider className="!mt-8 max-lg:!mt-5 !-z-10 !h-0.5 !w-full !bg-white" />
        </motion.div>

        <span className="z-10 bg-black px-2.5 left-[10%] max-lg:left-10 absolute pt-2 max-lg:pt-0 text-5xl max-lg:text-4xl font-['BebasNeue']">
          {currentData.title}
        </span>

        <div className="markdown-container mt-6 overflow-y-auto pr-3 pl-3 overflow-x-hidden">
          <Markdown
            components={{
              h1: ({ node, ...props }) => (
                <h1 id={generateSlug(props.children as string)} {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 id={generateSlug(props.children as string)} {...props} />
              ),
              img: ({ node, ...props }) => (
                        <LazyLoadImage effect="blur" {...props} />
              ),
            }}
            rehypePlugins={[rehypeRaw]}
          >
            {currentData.markdown}
          </Markdown>
        </div>
      </div>
    </div>
  )
}
