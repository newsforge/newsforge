import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Article } from './feed.entity';

export interface CreateArticleDto {
  userId: string;
  title: string;
  link: string;
  publishedAt: Date;
}

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article = this.articleRepository.create(createArticleDto);
    return await this.articleRepository.save(article);
  }

  async findLatestArticles(limit: number = 10): Promise<Article[]> {
    return await this.articleRepository.find({
      order: {
        publishedAt: 'DESC',
      },
      take: limit,
    });
  }

  async findLatestArticlesByUser(
    userId: string,
    limit: number = 10,
  ): Promise<Article[]> {
    return await this.articleRepository.find({
      where: { userId },
      order: {
        publishedAt: 'DESC',
      },
      take: limit,
    });
  }

  async findAll(): Promise<Article[]> {
    return await this.articleRepository.find();
  }

  async findOne(id: number): Promise<Article> {
    return await this.articleRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.articleRepository.delete(id);
  }
}
