import { Server } from '@overnightjs/core'
import { json } from 'express'
import { ForecastController } from './controller/forecast'

export class SetupServer extends Server {
  constructor (private readonly port:number = 3000) {
    super()
  }

  public init (): void {
    this.setupExpress()
    this.setupControllers()
  }

  private setupExpress (): void {
    this.app.use(json())
  }

  private setupControllers (): void {
    const forecastController = new ForecastController()

    this.addControllers([
      forecastController
    ])
  }
} 
