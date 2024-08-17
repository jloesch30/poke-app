import path from 'path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths'


export default defineConfig({
  resolve: {
    alias: {
      lib: path.resolve(__dirname, './src/lib'),
      utils: path.resolve(__dirname, './src/utils'),
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
    setupFiles: ['./testSetup.ts'],
    globals: true,
  }
})
