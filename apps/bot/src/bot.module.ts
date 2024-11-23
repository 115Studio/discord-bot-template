import { Logger, Module } from '@nestjs/common'
import { BotService, EventsService } from './services'
import { DjsModule } from '@app/djs'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ActivityType, GatewayIntentBits } from 'discord-api-types/v10'
import { Client } from 'discord.js'
import { CommandsModule } from '@app/commands'
import { DbModule, TypeOrmNestLoggerAdapter } from '@app/db'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { DataSource } from 'typeorm'
import { DatabaseError } from 'pg-protocol'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NEST_CONFIG_ENV_FILE || '.env'
    }),
    DjsModule.forRootAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: (config: ConfigService) => ({
        token: config.getOrThrow('DISCORD_TOKEN'),
        client: () => {
          return new Client({
            intents: [
              GatewayIntentBits.Guilds,
              GatewayIntentBits.GuildMembers,
              GatewayIntentBits.GuildMessages,
              GatewayIntentBits.MessageContent
            ],
            presence: {
              status: 'online',
              activities: [
                {
                  type: ActivityType.Custom,
                  name: 'Works!'
                }
              ]
            }
          })
        }
      })
    }),
    CommandsModule,
    TypeOrmModule.forRootAsync({
      inject: [ ConfigService ],
      imports: [ ConfigModule ],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        database: cfg.getOrThrow<string>('POSTGRES_DATABASE'),
        port: Number(cfg.getOrThrow<string>('POSTGRES_PORT')),
        username: cfg.getOrThrow('POSTGRES_USERNAME'),
        password: cfg.getOrThrow('POSTGRES_PASSWORD'),
        host: cfg.getOrThrow('TYPEORM_DB_HOST'),
        autoLoadEntities: true,
        synchronize: true,
        logger: (() => {
          try {
            JSON.parse(cfg.get('TYPEORM_LOGGING')).catch(() => false)
            return new TypeOrmNestLoggerAdapter(new Logger())
          } catch (e) { /* empty */ }
        })()
      }),
      dataSourceFactory: async (options: PostgresConnectionOptions) => {
        let dataSource = new DataSource(options)

        try {
          await dataSource.initialize()
        } catch (e) {
          if (!(e instanceof DatabaseError)) throw e
          if (e.code !== '3D000') throw e
          // if the error is a missing database, then create a connection to the default database
          const templateDataSource = new DataSource({
            ...options,
            database: 'postgres'
          })

          await templateDataSource.initialize()
          // create a database
          await templateDataSource.query(`CREATE DATABASE ${options.database}`)

          dataSource = new DataSource(options)
        }

        return dataSource as DataSource
      }
    }),
    DbModule
  ],
  controllers: [],
  providers: [ BotService, EventsService ],
})
export class BotModule {}
