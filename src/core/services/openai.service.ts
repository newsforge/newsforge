import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { FeedItem } from './rss.service';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async listAvailableModels() {
    try {
      const models = await this.openai.models.list();
      return models.data
        .filter((model) => model.id.includes('gpt'))
        .map((model) => ({
          id: model.id,
          created: new Date(model.created * 1000).toISOString(),
          owned_by: model.owned_by,
        }));
    } catch (error) {
      throw new Error(`Failed to list models: ${error.message}`);
    }
  }

  async ask(question: string): Promise<string> {
    // console.log(await this.listAvailableModels());

    try {
      const response = await this.openai.chat.completions.create({
        model: 'chatgpt-4o-latest',
        temperature: 0,
        messages: [
          {
            role: 'user',
            content: question,
          },
        ],
        max_tokens: 100,
      });

      return response.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      throw new Error(`Failed to get answer: ${error.message}`);
    }
  }

  async filterArticles(
    items: FeedItem[],
    criteriaList: string[],
  ): Promise<FeedItem[]> {
    const newsList = JSON.stringify(items);
    const criteria = JSON.stringify(criteriaList);

    const question = `
    This is my news list in json format: ${newsList}
    I want to see which ones pass these criteria: ${criteria}.
    Answer me only with a json array of objects without any explanation.
    Objects must contain the link property of the news that meets the criteria alongside a field named reason that explains how it's related to a criteria.
    Reason must be in maximum 6 words
    Answer me only with plain text without markup
    `;
    const response = await this.ask(question);
    console.log('ai:', response);
    for (let i = 0; i < items.length; i++) {
      console.log(i, items[i].title);
    }

    const indexes: { link: string; reason: string }[] = JSON.parse(response);

    console.log(indexes);

    return [];
  }
}
