import { defineNitroConfig } from 'nitro/config'

export default defineNitroConfig({
  serveStatic: true,
  noExternals: false,
  rollupConfig: {
    external: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei'],
  },
})
