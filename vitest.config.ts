import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vitest-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: [
      'src/**/*.{spec,test}.ts'
    ],
    exclude: [
      'test/**'
    ]
  }
})
