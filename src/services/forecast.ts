import { ForecastPoint, StormGlass } from '@src/clients/stormGlass'

export enum BeachPosition {
  N = 'N',
  S = 'S',
  W = 'W',
  E = 'E',
}

export interface Beach {
  name: string
  position: BeachPosition
  lat: number
  lng: number
  user: string
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export interface TimeForecast {
  time: string
  forecast: BeachForecast[]
}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(beaches: Beach[]): Promise<TimeForecast[]> {
    const pointsWithCorrectSource: BeachForecast[] = []

    for (const beach of beaches) {
      const { name, position, lat, lng } = beach

      const points = await this.stormGlass.fetchPoints(lat, lng)
      const enrichedBeachData = points.map(point => ({
        ...{
          name,
          lat,
          lng,
          position,
          rating: 1, // TODO
        },
        ...point,
      }))

      pointsWithCorrectSource.push(...enrichedBeachData)
    }

    return this.mapForecastByTime(pointsWithCorrectSource)
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = []

    for (const point of forecast) {
      const timePoint = forecastByTime.find(forecastPoint => forecastPoint.time === point.time)

      if (timePoint) {
        timePoint.forecast.push(point)
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        })
      }
    }

    return forecastByTime
  }
}
