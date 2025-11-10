import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router'
import { Button, Divider } from '@mui/material'
import { useEffect, useState } from 'react'
import cn from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import Menu from '../components/Menu'

export const Route = createFileRoute('/_canvas')({
  component: CanvasLayout,
})

function CanvasLayout() {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  return (
    <div className="h-full w-full flex flex-row items-center max-md:flex-col max-md:items-start">
      {/* Desktop Menu */}
      <div className="flex items-center h-full max-md:hidden">
        <Menu />
        <Divider orientation="vertical" className="!bg-white w-0.5 h-[95%] relative" />
      </div>

      {/* Mobile Menu */}
      <div className="hidden max-md:flex max-md:flex-col max-md:w-full max-md:items-center">
        <Button
          className={cn(
            "hamburger hamburger-slider self-start",
            { 'is-active': isMenuOpen }
          )}
          onClick={() => setMenuOpen(!isMenuOpen)}
        >
          <span className="hamburger-box">
            <span className="hamburger-inner" />
          </span>
        </Button>
        {isMenuOpen && (
          <div className="flex items-center justify-center flex-1">
            <Menu />
          </div>
        )}
      </div>

      <div className={cn(
        "h-full w-full max-md:h-[calc(100%-44px)]",
        { 'max-md:opacity-30 max-md:blur-[8px]': isMenuOpen }
      )}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            className="h-full w-full"
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
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

