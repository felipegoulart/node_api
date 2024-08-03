import { describe, expect, it } from 'vitest'
import supertest from 'supertest'

describe('Functional: Beach forecast functional test', () => {
  it('should return a forecast with just few times', () => {
    const { body, status } = supertest(app).get('/forecast')

    expect(status).toBe(200)
    expect(body).toBe('')
  })
})
