import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { PreferencesModule } from './preferences/preferences.module';
import { FirebaseService } from './core/services/firebase.service';
import databaseConfig from './core/config/database.config';
import firebaseConfig from './core/config/firebase.config';
import { validate } from './core/config/env.validation';
import { UsersModule } from './users/users.module';

@Module({
  controllers: [],
  providers: [FirebaseService],
  imports: [
    UsersModule,
    PreferencesModule,
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
