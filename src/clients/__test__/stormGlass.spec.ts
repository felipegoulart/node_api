import axios from 'axios'
import { describe, expect, it, vi, Mocked } from 'vitest'
import { StormGlass } from '@src/clients/stormGlass'
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json'
import stormGlassNormalizedResponse3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json'

vi.mock('axios')

describe('UNIT: StormGlass client', () => {
  // It transform the axios instance in mocked vitest
  const mockedAxios = axios as Mocked<typeof axios>

  const lat = -33.792726
  const lng = 151.289824

  it('should return the normalized forecast from the StormGlass service', async () => {

    mockedAxios.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture })

    const stormGlass = new StormGlass(mockedAxios)
    const response = await stormGlass.fetchPoints(lat, lng)

    expect(response).toEqual(stormGlassNormalizedResponse3HoursFixture)
  })

  it('should exclude incomplete data points', async () => {
    const incompleteData = {
      hours: [
        {
          windDirection: {
            noaa: 300
          },
          time: '2024-08-04T00:00:00+00:00'
        }
      ]
    }

    mockedAxios.get.mockResolvedValueOnce({ data: incompleteData })

    const stormGlass = new StormGlass(mockedAxios)
    const response = await stormGlass.fetchPoints(lat, lng)

    expect(response).toEqual([])
  })

  it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
    mockedAxios.get.mockRejectedValue({ message : 'Network Error' })

    const stormGlass = new StormGlass(mockedAxios)

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to comunicate to StormGlass: Network Error'
    )
  })

  it('should get a StormGlassResponseError when the StormGlass service responds with error', async () => {
    mockedAxios.get.mockRejectedValue({ 
      response: {
        status: 429,
        data: { errors: ['Rate Limit reached'] }
      }
     })

    const stormGlass = new StormGlass(mockedAxios)

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    )
  })
})
