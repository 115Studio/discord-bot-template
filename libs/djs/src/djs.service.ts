import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Client } from 'discord.js'
import { DjsModuleOptions } from '@app/djs/interfaces'
import { DJS_OPTIONS } from '@app/djs/djs.constants'

@Injectable()
export class DjsService implements OnModuleInit, OnModuleDestroy {
  // bot instance
  private readonly _main: Client

  constructor(
    @Inject(DJS_OPTIONS) private readonly options: DjsModuleOptions
  ) {
    this._main = this.options.client() // create bot instance
  }

  // offline bot when application is stopped
  async onModuleDestroy() {
    await this.client.destroy()
  }

  // login bot when application is started
  async onModuleInit() {
    await this.client.login(this.options.token)
  }

  get client() {
    return this._main
  }
}
