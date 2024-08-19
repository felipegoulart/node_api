import { InternalError } from '@src/util/errors/internal-error'
import { AxiosError, AxiosStatic } from 'axios'
import config, { type IConfig } from 'config'

export interface StormGlassPointSource {
  [key: string]: number
}

export interface StormGlassPoint {
  readonly time: string
  readonly swellDirection: StormGlassPointSource
  readonly swellHeight: StormGlassPointSource
  readonly swellPeriod: StormGlassPointSource
  readonly waveDirection: StormGlassPointSource
  readonly waveHeight: StormGlassPointSource
  readonly windDirection: StormGlassPointSource
  readonly windSpeed: StormGlassPointSource
}

export interface StormGlassForecastReponse {
  hours: StormGlassPoint[]
}

export interface ForecastPoint {
  time: string
  swellDirection: number
  swellHeight: number
  swellPeriod: number
  waveDirection: number
  waveHeight: number
  windDirection: number
  windSpeed: number
}

export class ClientRequestError extends InternalError {
  constructor (message: string) {
    const internalMessage = 'Unexpected error when trying to comunicate to StormGlass'
    super(`${internalMessage}: ${message}`)
  }
}

export class StormGlassResponseError extends InternalError {
  constructor (message: string) {
    const internalMessage = 'Unexpected error returned by the StormGlass service:'
    super(`${internalMessage} ${message}`)
  }
}

const stormGlassResourceConfig: IConfig = config.get('App.resources.StormGlass')

export class StormGlass {
  readonly stormGlassAPIParams: string =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed'
  readonly stormGlassApiSource: string = 'noaa'

  constructor(protected request: AxiosStatic) {}

  public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
    try {
      const response = await this.request.get<StormGlassForecastReponse>(
        `${stormGlassResourceConfig.get('apiUrl')}/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassApiSource}&lat=${lat}&lng=${lng}`,
        {
          headers: {
            Authorization: 'fake-token',
          },
        }
      )
  
      return this.normalizeResponse(response.data)
    } catch (error: unknown) {

      if ((error as AxiosError).response && (error as AxiosError).response?.status) {
        const requestError = error as AxiosError
        const messageError = `Error: ${JSON.stringify(requestError.response?.data)} Code: ${requestError.response?.status}`
        
        throw new StormGlassResponseError(messageError)
      }

      throw new ClientRequestError((error as Error).message)
    }
  }

  private normalizeResponse(points: StormGlassForecastReponse): ForecastPoint[] {
    const filteredPoint = points.hours.filter(this.isValidPoint.bind(this))

    return filteredPoint.map(
      (point): ForecastPoint => ({
        time: point.time,
        swellDirection: point.swellDirection[this.stormGlassApiSource],
        swellHeight: point.swellHeight[this.stormGlassApiSource],
        swellPeriod: point.swellPeriod[this.stormGlassApiSource],
        waveDirection: point.waveDirection[this.stormGlassApiSource],
        waveHeight: point.waveHeight[this.stormGlassApiSource],
        windDirection: point.windDirection[this.stormGlassApiSource],
        windSpeed: point.windSpeed[this.stormGlassApiSource],
      })
    )
  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassApiSource] &&
      point.swellHeight?.[this.stormGlassApiSource] &&
      point.swellPeriod?.[this.stormGlassApiSource] &&
      point.waveDirection?.[this.stormGlassApiSource] &&
      point.waveHeight?.[this.stormGlassApiSource] &&
      point.windDirection?.[this.stormGlassApiSource] &&
      point.windSpeed?.[this.stormGlassApiSource]
    )
  }
}
