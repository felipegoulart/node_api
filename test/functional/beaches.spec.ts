import { Beach } from '@src/model/beach'
import { describe, expect, it, vi } from 'vitest'

describe('Functional: Beaches functional test', () => {
  describe('When creating a beach', () => {
    it('should create a beach with success', async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      }

      const response = await testRequest.post('/beaches').send(newBeach)

      expect(response.status).toEqual(201)
      expect(response.body).toEqual(expect.objectContaining(newBeach))
    })

    it('should return 422 when there is a validation error', async () => {
      const newBeach = {
        lat: 'invalid_string',
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      }

      const response = await testRequest.post('/beaches').send(newBeach)

      expect(response.status).toEqual(422)
      expect(response.body).toEqual({
        error:
          'Beach validation failed: lat: Cast to Number failed for value "invalid_string" (type string) at path "lat"',
      })
    })

    it('should return 500 when there is any error other than validation error', async () => {
      vi.spyOn(Beach.prototype, 'save').mockImplementationOnce(() => Promise.reject('fail to create beach'))

      const newBeach = {
        lat: 'invalid_string',
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      }

      const response = await testRequest.post('/beaches').send(newBeach)

      expect(response.status).toEqual(500)
      expect(response.body).toEqual({
        error: 'Internal Server Error',
      })
    })
  })
})
