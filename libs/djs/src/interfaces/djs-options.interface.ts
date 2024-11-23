/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from 'discord.js'
import { ModuleMetadata, Type } from '@nestjs/common'

export interface DjsModuleOptions {
  token: string
  client: () => Client
}

export interface DjsModuleOptionsFactory {
  createDjsOptions(): DjsModuleOptions | Promise<DjsModuleOptions>
}

export interface DjsModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<DjsModuleOptionsFactory>
  useClass?: Type<DjsModuleOptionsFactory>
  inject?: any[]
  useFactory?: (...args: any[]) => Promise<DjsModuleOptions> | DjsModuleOptions
}
