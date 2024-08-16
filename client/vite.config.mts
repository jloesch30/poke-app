import path from 'path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths'


export default defineConfig({
  resolve: {
    alias: {
      lib: path.resolve(__dirname, './src/lib'),
    }
  },
	plugins: [
    react(),
    tsConfigPaths()
  ],
	server: {
		port: 3000,
		host: true
	},
	preview: {
		port: 3000
	},
  test: {
    include: ['**/*.test.{ts,tsx}'],
    globals: true,
  }
})
