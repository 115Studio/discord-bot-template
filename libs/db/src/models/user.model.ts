import { SnowflakeIdModel } from '@app/utils'
import { Entity } from 'typeorm'

@Entity()
export class UserModel extends SnowflakeIdModel {}
