import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useLocation,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import GlobalStyles from '@mui/material/GlobalStyles'
import { useEffect } from 'react'

import * as gtag from '../helpers/gtags.client'
import { theme } from '../theme'

import appCss from '../styles.css?url'

// You can add these to your .env file
const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID
const API_URL = import.meta.env.VITE_API_URL

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'R2DLiu.com',
      },
      {
        property: 'og:title',
        content: 'R2DLiu.com',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
    ],
    scrollRestoration: 'smooth',
  }),

  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()

  useEffect(() => {
    if (GA_TRACKING_ID?.length) {
      gtag.pageview(location.pathname, GA_TRACKING_ID)
    }
  }, [location])

  return (
    <RootDocument>
      <StyledEngineProvider enableCssLayer>
        <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
        <ThemeProvider theme={theme}>
          <Outlet />
        </ThemeProvider>
      </StyledEngineProvider>
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {import.meta.env.DEV || !GA_TRACKING_ID ? null : (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <script
              async
              id="gtag-init"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.API_URL = '${API_URL || ''}'`,
          }}
        />
        {children}
        <Scripts />
      </body>
    </html>
  )
}
