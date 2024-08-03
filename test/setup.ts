import { beforeAll } from 'vitest'
import supertest, { Test, SuperTest } from 'supertest'
import { SetupServer } from '@src/server'

beforeAll(() => {
  const setupServer = new SetupServer()
  
  setupServer.init()

  // It was necessary to clean the type and convert it to SuperTest<Test>, which is expected by testRequest.
  global.testRequest = supertest(setupServer.app) as unknown as SuperTest<Test>
})
