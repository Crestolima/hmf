import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [preact()],
  esbuild: {
    loader: 'jsx', // Treat .js files as JSX
    include: /src\/.*\.[tj]sx?$/, // Include .js, .ts, .jsx, and .tsx files from src folder
  },
  server: {
    host: true, // Expose on 0.0.0.0 for external access
    port: 5173, // Optional: set the port explicitly
  },
})
