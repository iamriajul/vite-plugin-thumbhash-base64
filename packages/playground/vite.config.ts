import { defineConfig } from 'vite'
import { thumbHash } from 'vite-plugin-thumbhash-base64'

export default defineConfig({
  plugins: [thumbHash()],
  server: {
    port: 8848,
  },
})
