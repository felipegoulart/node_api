import { afterAll, beforeAll } from 'vitest'
import supertest, { Test, SuperTest } from 'supertest'
import { SetupServer } from '@src/server'

let setupServer: SetupServer

beforeAll(async () => {
  setupServer = new SetupServer()

  await setupServer.init()

  // It was necessary to clean the type and convert it to SuperTest<Test>, which is expected by testRequest.
  global.testRequest = supertest(setupServer.app) as unknown as SuperTest<Test>
})

afterAll(async () => {
  await setupServer.close()
})
