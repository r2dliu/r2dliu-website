import { Link, createRouter } from '@tanstack/react-router'
import { Button } from '@mui/material'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultViewTransition: true,
    defaultNotFoundComponent: () => {
      return (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="p-3 bg-white font-['HelveticaNeueBold'] text-[32px] text-black">
            You're not supposed to be here...
          </div>
          <Link to="/">
            <Button
              className="font-['HelveticaNeueMedium'] mt-5 hover:bg-white hover:text-black"
              variant="outlined"
              color="primary"
            >
              Return Home
            </Button>
          </Link>
        </div>
      )
    },
  })

  return router
}
