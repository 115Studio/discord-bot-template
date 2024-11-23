import { Logger as NestLogger } from '@nestjs/common'
// eslint-disable-next-line import/named
import { Logger } from 'typeorm'

export class TypeOrmNestLoggerAdapter implements Logger {
  constructor(private readonly logger: NestLogger = new NestLogger('TypeORM')) {}

  logQuery(query: string, parameters?: unknown[]) {
    this.logger.verbose(`query: ${query}: ${parameters?.join(', ') ?? '<no-parameters>'}`)
  }

  logQueryError(error: string | Error, query: string, parameters?: unknown[]) {
    this.logger.error(`query error: ${query}: ${parameters?.join(', ') ?? '<no-parameters>'}\n\t${error}`)
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[]) {
    this.logger.warn(`slow query(${time}ms): ${query}: ${parameters?.join(', ') ?? '<no-parameters>'}`)
  }

  logSchemaBuild(message: string) {
    this.logger.log(`schema build: ${message}`)
  }

  logMigration(message: string) {
    this.logger.log(`migrations: ${message}`)
  }

  log(level: 'log' | 'info' | 'warn', message: unknown) {
    if (level === 'log') {
      this.logger.log(message)
    } else if (level === 'info') {
      this.logger.log(message)
    } else if (level === 'warn') {
      this.logger.warn(message)
    }
  }
}
