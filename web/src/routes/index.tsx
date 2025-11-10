import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@mui/material'
import { motion } from 'framer-motion'
import { useState } from 'react'
import cn from 'classnames'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const [isClicked, setIsClicked] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="h-full overflow-hidden flex flex-col items-center justify-center">
      <div className="font-['BebasNeue'] text-8xl leading-none">David Liu</div>
      <div className="pt-1.5 font-['HelveticaNeueMedium'] text-xl pb-6">
        Software | Climbing | Melee
      </div>
      <div className="relative">
        <Button
          className={cn("font-['HelveticaNeueBold'] !border-0 active:!bg-transparent focus:!bg-transparent", {
            'hover:bg-white hover:text-black': !isClicked,
          })}
          variant="outlined"
          color="primary"
          onClick={() => {
            setIsClicked(true)
          }}
        >
          Explore
        </Button>
        <motion.div
          className="absolute top-0 left-0 h-0.5 bg-white"
          initial={{ width: '100%' }}
          animate={isClicked ? { width: 0 } : {}}
          transition={{ duration: 0.15, delay: 0, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-0.5 bg-white"
          initial={{ height: '100%' }}
          animate={isClicked ? { height: 0 } : {}}
          transition={{ duration: 0.15, delay: 0.15, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-0 right-0 h-0.5 bg-white"
          initial={{ width: '100%' }}
          animate={isClicked ? { width: 0 } : {}}
          transition={{ duration: 0.15, delay: 0.3, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-0 right-0 w-0.5 bg-white"
          initial={{ height: '100%' }}
          animate={isClicked ? { height: 0 } : {}}
          transition={{ duration: 0.15, delay: 0.45, ease: 'linear' }}
          onAnimationComplete={() => {
            if (isClicked) {
              navigate({ to: '/about' })
            }
          }}
        />
      </div>
    </div>
  )
}
