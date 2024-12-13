import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  Req,
  Optional,
  UseGuards,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { Article } from './feed.entity';
import { FirebaseAuthGuard } from 'src/core/guards/firebase-auth.guard';

@Controller('feed')
@UseGuards(FirebaseAuthGuard)
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  async getUserFeed(
    @Req() req,
    @Optional()
    @Query('limit', new ParseIntPipe({ optional: true }))
    limit: number = 10,
  ): Promise<Article[]> {
    return this.feedService.findLatestArticlesByUser(req.user.uid, limit);
  }
}
