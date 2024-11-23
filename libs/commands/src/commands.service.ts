import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Collection } from '@discordoo/collection'
import {
  AnyAppCommandContext, AnyAppCommandData,
  AnyCommand, AnyCommandData,
  AnyComponentCommandContext, CommandData,
  TextCommandContext, TextCommandData
} from '@app/commands/interfaces'
import { AppCommandType } from '@app/constants'
import { Reflector } from '@nestjs/core'
import { COMMAND_DATA_KEY } from '@app/commands/command.decorator'

@Injectable()
export class CommandsService {
  public readonly list: Collection<string, AnyCommand> = new Collection()

  constructor(
    private readonly config: ConfigService,
    private readonly reflector: Reflector
  ) {}

  register(...commands: AnyCommand[]) {
    commands.forEach(c => {
      const data = this.reflector.get<AnyCommandData>(COMMAND_DATA_KEY, c.constructor)
      this.list.set(c.type === AppCommandType.Slash ||
        c.type === AppCommandType.UserContext ||
        c.type === AppCommandType.MessageContext ?
        `${c.type}_${data.name}` : data.name, c
      )

      if ('aliases' in data && data.aliases) {
        data.aliases.forEach(a => this.list.set(a, c))
      }
    })
  }

  async handleText(commandContext: TextCommandContext) {
    const { message } = commandContext

    const commandName = message.content.slice(this.config.getOrThrow('BOT_PREFIX').length)
    const command = this.list.get(commandName)

    if (command === undefined || command.type !== AppCommandType.Text) return
    const commandData = this.reflector.get<TextCommandData>(COMMAND_DATA_KEY, command.constructor)

    if (commandData.ownersOnly && !this.config.getOrThrow<string>('OWNER_IDS').includes(message.author.id)) {
      return message.reply('Owners only')
    }

    return command.handle(commandContext)
  }

  async handleAppCommand(commandContext: AnyAppCommandContext) {
    const { interaction } = commandContext

    if (!interaction.isCommand()) return
    let commandType: AppCommandType | undefined

    if (interaction.isChatInputCommand()) {
      commandType = AppCommandType.Slash
    } else if (interaction.isUserContextMenuCommand()) {
      commandType = AppCommandType.UserContext
    } else if (interaction.isMessageContextMenuCommand()) {
      commandType = AppCommandType.MessageContext
    }

    if (!commandType) return
    const command = this.list.get(`${commandType}_${commandContext.name}`)

    if (!command) return
    const validCommandTypes = [
      AppCommandType.Slash,
      AppCommandType.UserContext,
      AppCommandType.MessageContext,
      AppCommandType.Autocomplete
    ]

    if (!validCommandTypes.includes(command.type)) return

    const author = interaction.user.id
    const commandData = this.reflector.get<AnyAppCommandData>(COMMAND_DATA_KEY, command.constructor)

    if (commandData.ownersOnly && !this.config.getOrThrow<string>('OWNER_IDS').includes(author)) {
      return interaction.reply({
        content: 'Owners only',
        ephemeral: true
      })
    }

    // TODO fix typings
    return command.handle(commandContext as never)
  }


  async handleComponentCommand(commandContext: AnyComponentCommandContext) {
    const { interaction } = commandContext

    if (!interaction.isMessageComponent() && !interaction.isModalSubmit()) return
    const command = this.list.get(commandContext.name)

    if (!command) return
    const validCommandTypes = [
      AppCommandType.Button,
      AppCommandType.SelectMenu,
      AppCommandType.ModalSubmit
    ]

    if (!validCommandTypes.includes(command.type)) return

    const author = interaction.user.id
    const commandData = this.reflector.get<CommandData>(COMMAND_DATA_KEY, command.constructor)

    if (commandData.ownersOnly && !this.config.getOrThrow<string>('OWNER_IDS').includes(author)) {
      return interaction.reply({
        content: 'Owners only',
        ephemeral: true
      })
    }

    // TODO fix typings
    return command.handle(commandContext as never)
  }
}
