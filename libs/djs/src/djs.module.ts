import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
import { DjsService } from './djs.service'
import { DjsModuleAsyncOptions, DjsModuleOptions, DjsModuleOptionsFactory } from '@app/djs/interfaces'
import { DJS_OPTIONS } from './djs.constants'

/**
 * What is this?
 *
 * This library stores a single client (bot) instance, which we create in the file djs.service.ts
 * This instance can later be used anywhere as many times as you want by simply importing DjsService
 * Below is the scary code for creating options in the module
 * */
@Module({
  providers: [ DjsService ],
  exports: [ DjsService ]
})
@Global()
export class DjsModule {
  public static forRoot(config: DjsModuleOptions): DynamicModule {
    return {
      module: DjsModule,
      providers: [
        {
          provide: DJS_OPTIONS,
          useValue: config
        }
      ]
    }
  }

  public static forRootAsync(options: DjsModuleAsyncOptions): DynamicModule {
    return {
      module: DjsModule,
      imports: options.imports,
      providers: this.createAsyncProviders(options)
    }
  }

  private static createAsyncProviders(options: DjsModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [ this.createAsyncOptionsProvider(options) ]
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        useClass: options.useClass!,
        provide: options.useClass!
      }
    ]
  }

  private static createAsyncOptionsProvider(options: DjsModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: DJS_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || []
      }
    }

    return {
      provide: DJS_OPTIONS,
      useFactory: async (optionsFactory: DjsModuleOptionsFactory) => (
        await optionsFactory.createDjsOptions()
      ),
      inject: [ (options.useExisting || options.useClass)! ]
    }
  }
}
