import { BeforeInsert, CreateDateColumn, PrimaryColumn } from 'typeorm'
import { snowflake } from '@app/utils/snowflake'

export class SnowflakeIdModel {
  @PrimaryColumn()
  declare id: string

  @CreateDateColumn()
  declare createdAt: Date

  @BeforeInsert()
  beforeInsert() {
    if (this.id) return
    this.id = snowflake()
  }
}
