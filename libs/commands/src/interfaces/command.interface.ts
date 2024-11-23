import {
  AnyCommandContext, AutocompleteCommandContext, ButtonCommandContext,
  MessageCommandContext, ModalSubmitCommandContext, SelectMenuCommandContext,
  SlashCommandContext, TextCommandContext, UserCommandContext
} from './command-context.interface'
import { MaybePromise } from '@app/utils'
import { AppCommandType } from '@app/constants'
import {
  AnySelectMenuInteraction, ChatInputApplicationCommandData,
  MessageApplicationCommandData, UserApplicationCommandData
} from 'discord.js'

export interface CommandData {
  name: string
  // if true, the command can only be used by the bot developers (env.BOT_OWNERS)
  ownersOnly?: boolean
}

export interface TextCommandData extends CommandData {
  aliases?: string[]
}

export type AnyAppCommandData = (
    ChatInputApplicationCommandData | MessageApplicationCommandData | UserApplicationCommandData
  ) & CommandData

export type AnyCommandData = AnyAppCommandData | TextCommandData | CommandData

export interface AbstractCommand<C extends AnyCommandContext> {
  handle: (ctx: C) => MaybePromise<unknown>
}

export interface TextCommand extends AbstractCommand<TextCommandContext> {
  type: AppCommandType.Text
}

export interface SlashCommand extends AbstractCommand<SlashCommandContext> {
  type: AppCommandType.Slash
}

export interface UserCommand extends AbstractCommand<UserCommandContext> {
  type: AppCommandType.UserContext
}

export interface MessageCommand extends AbstractCommand<MessageCommandContext> {
  type: AppCommandType.MessageContext
}

export interface SelectMenuCommand<
  T extends AnySelectMenuInteraction = AnySelectMenuInteraction
> extends AbstractCommand<SelectMenuCommandContext<T>> {
  type: AppCommandType.SelectMenu
}

export interface ButtonCommand extends AbstractCommand<ButtonCommandContext> {
  type: AppCommandType.Button
}

export interface ModalSubmitCommand extends AbstractCommand<ModalSubmitCommandContext> {
  type: AppCommandType.ModalSubmit
}

export interface AutocompleteCommand extends AbstractCommand<AutocompleteCommandContext> {
  type: AppCommandType.Autocomplete
}

export type AnyCommand = TextCommand
  | SlashCommand
  | UserCommand
  | MessageCommand
  | SelectMenuCommand
  | ButtonCommand
  | ModalSubmitCommand
  | AutocompleteCommand

export type AnyAppCommand = SlashCommand | UserCommand | MessageCommand
