import { CustomIdSeparator } from '@app/constants'

// create `custom_id` with separator
export const makeCustomId = (...args: Array<string | number>) => args.join(CustomIdSeparator.Key)
