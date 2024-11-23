import { Type } from '@nestjs/common'
import { COMMAND_DATA_KEY } from '@app/commands'

/**
 * Returns the id of the command (useful for using in custom id)
 * @example .setCustomId(idOf(MyCommand));
 * @param command
 */
export const idOf = (command: Type): string => {
  const data = Reflect.getMetadata(COMMAND_DATA_KEY, command)
  if (!data) throw new Error(`Command ${command?.name ?? '?'} is not decorated with @AppCommand`)
  return data.name
}
