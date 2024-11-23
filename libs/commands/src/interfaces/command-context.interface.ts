import { ModuleRef } from '@nestjs/core'
import {
  AnySelectMenuInteraction,
  AutocompleteInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  Client,
  Message,
  MessageContextMenuCommandInteraction,
  ModalSubmitInteraction,
  UserContextMenuCommandInteraction
} from 'discord.js'
import { AppCommandType } from '@app/constants'

export interface AbstractCommandContext {
  moduleRef: ModuleRef
  client: Client
  // command name
  name: string
}

export interface TextCommandContext extends AbstractCommandContext {
  message: Message
  // command arguments (after the command name separated by a space)
  args: string[]
  prefix: string
}

export type AnyComponentInteraction = AnySelectMenuInteraction
  | ButtonInteraction
  | ModalSubmitInteraction

export type AnyInteraction = AnyComponentInteraction
  | ChatInputCommandInteraction
  | UserContextMenuCommandInteraction
  | MessageContextMenuCommandInteraction
  | AutocompleteInteraction

export interface AppCommandContext<I extends AnyInteraction = AnyInteraction> extends AbstractCommandContext {
  interaction: I
}

export interface ComponentCommandContext<T extends AnyComponentInteraction> extends AppCommandContext<T> {
  // command arguments (customId separated by CustomIdSeparator)
  args: string[]
}

export type SlashCommandContext = AppCommandContext<ChatInputCommandInteraction>
export type UserCommandContext = AppCommandContext<UserContextMenuCommandInteraction>
export type MessageCommandContext = AppCommandContext<MessageContextMenuCommandInteraction>
export type AutocompleteCommandContext = AppCommandContext<AutocompleteInteraction>

export type ButtonCommandContext = ComponentCommandContext<ButtonInteraction>
export type ModalSubmitCommandContext = ComponentCommandContext<ModalSubmitInteraction>
export type SelectMenuCommandContext<
  T extends AnySelectMenuInteraction = AnySelectMenuInteraction
> = ComponentCommandContext<T>

export interface CommandContextMap {
  [AppCommandType.Autocomplete]: AutocompleteCommandContext
  [AppCommandType.Button]: ButtonCommandContext
  [AppCommandType.MessageContext]: MessageCommandContext
  [AppCommandType.ModalSubmit]: ModalSubmitCommandContext
  [AppCommandType.SelectMenu]: SelectMenuCommandContext
  [AppCommandType.Slash]: SlashCommandContext
  [AppCommandType.Text]: TextCommandContext
  [AppCommandType.UserContext]: UserCommandContext
}

export type CommandContext<T extends AppCommandType> = CommandContextMap[T]

export type AnyAppCommandContext = CommandContext<
  AppCommandType.Slash | AppCommandType.UserContext |
  AppCommandType.MessageContext | AppCommandType.Autocomplete
>

export type AnyComponentCommandContext = CommandContext<
  AppCommandType.Button | AppCommandType.ModalSubmit | AppCommandType.SelectMenu
>

export type AnyCommandContext = CommandContext<AppCommandType>
