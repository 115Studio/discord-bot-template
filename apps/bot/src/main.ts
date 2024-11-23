import { NestFactory } from '@nestjs/core'
import { BotModule } from './bot.module'
import { FastifyAdapter } from '@nestjs/platform-fastify'

async function bootstrap() {
  const adapter = new FastifyAdapter({ ignoreTrailingSlash: true })
  const app = await NestFactory.create(BotModule, adapter)
  await app.listen(process.env.port ?? 3000)
}

bootstrap()
