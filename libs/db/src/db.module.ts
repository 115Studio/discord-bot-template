import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import * as models from './models'

@Module({
  imports: [
    // in order to use models in typeorm, we need to import them using TypeOrmModule.forFeature
    TypeOrmModule.forFeature(
      Object.values(models)
    )
  ],
  exports: [ TypeOrmModule ]
})
@Global()
export class DbModule {}
