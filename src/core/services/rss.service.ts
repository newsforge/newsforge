import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as Parser from 'rss-parser';
import { firstValueFrom } from 'rxjs';

export interface FeedItem {
  title: string;
  link: string;
  pubDate?: string;
  content?: string;
  contentSnippet?: string;
  guid?: string;
  categories?: string[];
  author?: string;
}

export interface Feed {
  title: string;
  description: string;
  link: string;
  items: FeedItem[];
  lastBuildDate?: string;
  pubDate?: string;
  language?: string;
}

@Injectable()
export class RssService {
  private readonly parser: Parser;

  constructor(private readonly httpService: HttpService) {
    this.parser = new Parser({
      customFields: {
        item: [
          ['media:content', 'mediaContent'],
          ['content:encoded', 'contentEncoded'],
        ],
      },
    });
  }

  async getFeed(url: string): Promise<Feed> {
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const feed = await this.parser.parseString(response.data);

      return {
        title: feed.title,
        description: feed.description,
        link: feed.link,
        items: feed.items.map((item) => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          content: item.content,
          contentSnippet: item.contentSnippet,
          guid: item.guid,
          categories: item.categories,
          author: item.author,
        })),
        lastBuildDate: feed.lastBuildDate,
        pubDate: feed.pubDate,
        language: feed.language,
      };
    } catch (error) {
      console.warn(error);
      // If direct fetch fails, try to discover the RSS feed URL
      try {
        const websiteContent = await firstValueFrom(this.httpService.get(url));
        const rssLinkMatch = websiteContent.data.match(
          /<link[^>]*type=['"]application\/rss\+xml['"][^>]*href=['"]([^'"]+)['"]/i,
        );

        if (rssLinkMatch?.length && rssLinkMatch[1]) {
          const rssUrl = new URL(rssLinkMatch[1], url).href;
          const rssResponse = await firstValueFrom(
            this.httpService.get(rssUrl),
          );
          const feed = await this.parser.parseString(rssResponse.data);

          return {
            title: feed.title,
            description: feed.description,
            link: feed.link,
            items: feed.items.map((item) => ({
              title: item.title,
              link: item.link,
              pubDate: item.pubDate,
              content: item.content,
              contentSnippet: item.contentSnippet,
              guid: item.guid,
              categories: item.categories,
              author: item.author,
            })),
            lastBuildDate: feed.lastBuildDate,
            pubDate: feed.pubDate,
            language: feed.language,
          };
        }
        throw new HttpException('RSS feed not found', HttpStatus.NOT_FOUND);
      } catch (e) {
        console.error(e);
        throw new HttpException(
          'Error fetching or parsing RSS feed',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async validateFeedUrl(url: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const contentType = response.headers['content-type'];
      return (
        contentType.includes('application/rss+xml') ||
        contentType.includes('application/xml') ||
        contentType.includes('text/xml')
      );
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
