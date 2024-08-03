import { mergeConfig, defineConfig } from 'vitest/config'
import vitestConfig from '../vitest.config'
import * as path from 'node:path'



export default mergeConfig(vitestConfig, defineConfig({
  test: {
    globals: true,
    setupFiles: [
      path.join(__dirname, './setup.ts')
    ]
  }
}))
