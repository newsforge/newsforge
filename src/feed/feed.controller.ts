import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  Req,
  UseGuards,
  Post,
} from '@nestjs/common';
import { FirebaseAuthGuard } from '../core/guards/firebase-auth.guard';
import { PreferenceService } from '../preferences/preference.service';
import { OpenAIService } from '../core/services/openai.service';
import { FeedItem, RssService } from '../core/services/rss.service';
import { FeedService } from './feed.service';
import { Article } from './feed.entity';

@Controller('feed')
@UseGuards(FirebaseAuthGuard)
export class FeedController {
  constructor(
    private readonly rss: RssService,
    private readonly ai: OpenAIService,
    private readonly feedService: FeedService,
    private readonly preferenceService: PreferenceService,
  ) {}

  @Get()
  async getUserFeed(
    @Req() req,
    @Query('limit', new ParseIntPipe({ optional: true }))
    limit: number = 10,
  ): Promise<Article[]> {
    return this.feedService.findLatestArticlesByUser(req.user.uid, limit);
  }

  @Post('curate')
  async curateFeed(@Req() req) {
    const news: FeedItem[] = [];
    const result = await this.preferenceService.findByUserId(req.user.uid);

    for (const source of result.sources) {
      const rssFeed = await this.rss.getFeed(source.source);
      const filteredItems = await this.ai.filterArticles(
        rssFeed.items,
        source.criteria,
      );
      news.push(...filteredItems);
    }

    return news;
  }
}
