import { AnyAppCommandData, CommandData, TextCommandData } from '@app/commands/interfaces'
import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common'

export const COMMAND_DATA_KEY = Symbol('AppCommandData')

export function AppCommand(data: AnyAppCommandData)
export function AppCommand(data: TextCommandData)
export function AppCommand(data: CommandData)
export function AppCommand(data: CommandData | AnyAppCommandData | TextCommandData) {
  return applyDecorators(
    SetMetadata(COMMAND_DATA_KEY, data),
    Injectable()
  )
}
