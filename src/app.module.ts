import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Module } from '@nestjs/common';

import { PreferencesModule } from './preferences/preferences.module';
import { FirebaseService } from './core/services/firebase.service';
import { TasksService } from './core/services/tasks.service';
import databaseConfig from './core/config/database.config';
import firebaseConfig from './core/config/firebase.config';
import { validate } from './core/config/env.validation';
import { UsersModule } from './users/users.module';
import { FeedModule } from './feed/feed.module';

@Module({
  controllers: [],
  providers: [FirebaseService, TasksService],
  imports: [
    UsersModule,
    FeedModule,
    PreferencesModule,
    ScheduleModule.forRoot(),
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
