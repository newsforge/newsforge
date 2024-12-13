import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { FirebaseService } from '../core/services/firebase.service';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { Article } from './feed.entity';

@Module({
  controllers: [FeedController],
  imports: [TypeOrmModule.forFeature([Article])],
  providers: [FeedService, FirebaseService],
  exports: [FeedService],
})
export class FeedModule {}
