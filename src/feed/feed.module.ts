import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { PreferencesModule } from '../preferences/preferences.module';
import { FirebaseService } from '../core/services/firebase.service';
import { OpenAIService } from '../core/services/openai.service';
import { RssService } from '../core/services/rss.service';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { Article } from './feed.entity';

@Module({
  controllers: [FeedController],
  imports: [
    PreferencesModule,
    TypeOrmModule.forFeature([Article]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [FeedService, FirebaseService, RssService, OpenAIService],
  exports: [FeedService],
})
export class FeedModule {}
