import { ModuleRef } from '@nestjs/core'
import { Injectable, Logger, Type } from '@nestjs/common'
import { CommandsService } from '@app/commands'

import { DjsService } from '@app/djs'
import { EventsService } from './events.service'

import * as commandList from '../commands'

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name)

  constructor(
    private readonly djs: DjsService,
    private readonly events: EventsService,
    private readonly commands: CommandsService,
    private readonly moduleRef: ModuleRef
  ) {
    void this.initCommands()

    this.djs.client.on('ready', () => {
      void this.events.handleReady(this.djs.client)
    })

    this.djs.client.on('messageCreate', message => {
      void this.events.handleMessageCreate(message)
    })

    this.djs.client.on('interactionCreate', interaction => {
      void this.events.handleInteractionCreate(interaction)
    })
  }

  private async initCommands() {
    const commands: Type[] = Object.values(commandList)

    for (const command of commands) {
      this.logger.log(`Registering command ${command.name}`)
      this.commands.register(await this.moduleRef.create(command))
    }
  }
}
