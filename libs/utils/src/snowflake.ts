import { SNOWFLAKE_EPOCH } from '@app/constants'

export function snowflake(timestamp: Date | number = Date.now()): string {
  if (timestamp instanceof Date) timestamp = timestamp.getTime()

  const b = BigInt

  return (b(timestamp) - b(SNOWFLAKE_EPOCH) << b(22)).toString()
}
