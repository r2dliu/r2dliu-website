import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig(({ mode }) => ({
  plugins: [
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    mode === 'production' ? nitro() : null,
    viteReact(),
  ].filter(Boolean),
  build: {
    manifest: true, // Generate manifest.json for asset mapping
    ssrManifest: true, // Generate SSR manifest
  },
  ssr: {
    noExternal: ['react-lazy-load-image-component'],
    external: ['three', '@react-three/fiber', '@react-three/drei', 'camera-controls'],
  },
}))

export default config
