import { ConfigService } from '@nestjs/config'
import { Injectable, Logger } from '@nestjs/common'
import { ModuleRef, Reflector } from '@nestjs/core'

import { Collection } from '@discordoo/collection'
import { AppCommandType, CustomIdSeparator } from '@app/constants'

import { Client, Message, REST, Routes } from 'discord.js'
import {
  AnyAppCommand,
  AnyAppCommandContext,
  AnyAppCommandData,
  AnyComponentCommandContext,
  AnyInteraction,
  COMMAND_DATA_KEY,
  CommandsService,
  TextCommandContext
} from '@app/commands'
import { tokenToId } from '@app/utils/token-to-id'

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name)

  constructor(
    private readonly commands: CommandsService,
    private readonly moduleRef: ModuleRef,
    private readonly reflector: Reflector,
    private readonly config: ConfigService
  ) {}

  async handleReady(client: Client) {
    this.logger.log('Bot is online')
    this.logger.log('Loading commands')

    type Result = Collection<string, AnyAppCommand>;

    // search for commands to register
    const appCommands = this.commands.list.filter<Result>(c => {
      return c.type === AppCommandType.MessageContext
        || c.type === AppCommandType.UserContext
        || c.type === AppCommandType.Slash
    }, { returnType: 'collection' }) as Result

    // build command data
    const result: AnyAppCommandData[] = appCommands.map(cmd => {
      return this.reflector.get<AnyAppCommandData>(COMMAND_DATA_KEY, cmd.constructor)
    })

    // if we have commands to register, register them
    if (result.length) {
      const rest = new REST({ version: '10' }).setToken(client.token)
      await rest.put(
        Routes.applicationCommands(
          tokenToId(this.config.getOrThrow('DISCORD_TOKEN'))
        ), { body: result }
      )
        .then(() => this.logger.log('Successfully registered application commands'))
        .catch(e => this.logger.error('Failed to register application commands', e))
    }

    this.logger.log('Bot is fully ready')
  }

  async handleMessageCreate(message: Message) {
    if (message.author.bot) return

    const args = message.content.split(/ +/g)

    // here we separate the command name from the arguments and prefix
    const commandName = args[0].slice(this.config.getOrThrow('BOT_PREFIX').length)

    const commandContext: TextCommandContext = {
      message,
      moduleRef: this.moduleRef,
      args,
      prefix: this.config.getOrThrow('BOT_PREFIX'),
      name: commandName,
      client: message.client
    }

    if (!args[0].startsWith(commandContext.prefix)) return // not a command

    return this.commands.handleText(commandContext)
  }

  async handleInteractionCreate(interaction: AnyInteraction): Promise<unknown> {
    if (interaction.isCommand() || interaction.isAutocomplete()) {
      const context: AnyAppCommandContext = {
        interaction: interaction as never, // TODO: fix typings
        moduleRef: this.moduleRef,
        client: interaction.client,
        name: interaction.commandName
      }

      return this.commands.handleAppCommand(context)
    }

    if (interaction.isMessageComponent() || interaction.isModalSubmit()) {
      const args = interaction.customId.split(CustomIdSeparator.Key)

      const context: AnyComponentCommandContext = {
        interaction: interaction as never, // TODO: fix typings
        moduleRef: this.moduleRef,
        client: interaction.client,
        name: args[0],
        args
      }

      return this.commands.handleComponentCommand(context)
    }
  }
}
