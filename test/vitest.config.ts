import { defineConfig } from 'vitest/config'
import vitestConfig from '../vitest.config'
import * as path from 'node:path'

export default
  defineConfig({
    ...vitestConfig,
    test: {
      globals: true,
      setupFiles: [path.join(__dirname, './setup.ts')],
      include: [
        'test/**/*.spec.ts'
      ],
      exclude: [
        'src/**'
      ]
    },
  })
