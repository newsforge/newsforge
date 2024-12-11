import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import databaseConfig from './config/database.config';
import firebaseConfig from './config/firebase.config';
import { validate } from './config/env.validation';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, firebaseConfig],
      validate,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...(await configService.get('database')),
      }),
    }),
  ],
})
export class AppModule {}
