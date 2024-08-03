import { beforeAll } from 'vitest'
import supertest from 'supertest'
import { SetupServer } from '@src/server'

// hooks are reset before each suite
beforeAll(() => {
  const setupServer = new SetupServer()
  
  setupServer.init()

  global.testRequest = supertest(setupServer.app)
})
