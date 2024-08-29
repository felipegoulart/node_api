import { Server } from '@overnightjs/core'
import { json } from 'express'
import { ForecastController } from './controller/forecast'
import * as database from './database'

export class SetupServer extends Server {
  constructor(private readonly port: number = 3000) {
    super()
  }

  public async init(): Promise<void> {
    this.setupExpress()
    this.setupControllers()
    await this.setupDatabase()
  }

  private setupExpress(): void {
    this.app.use(json())
  }

  private async setupDatabase (): Promise<void> {
    await database.connect()
  }

  public async close(): Promise<void> {
    await database.close()
  }

  private setupControllers(): void {
    const forecastController = new ForecastController()

    this.addControllers([forecastController])
  }
}
