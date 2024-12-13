import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Preference, NewsSource } from './preference.entity';

@Injectable()
export class PreferenceService {
  constructor(
    @InjectRepository(Preference)
    private readonly preferenceRepository: Repository<Preference>,
  ) {}

  async findByUserId(userId: string): Promise<Preference> {
    const preference = await this.preferenceRepository.findOne({
      where: { userId },
    });
    if (!preference) {
      const newPreference = this.preferenceRepository.create({
        userId,
        sources: [],
      });
      return await this.preferenceRepository.save(newPreference);
    }
    return preference;
  }

  async updateApiKey(userId: string, apiKey: string): Promise<Preference> {
    const preference = await this.findByUserId(userId);
    preference.apiKey = apiKey;
    return await this.preferenceRepository.save(preference);
  }

  async updateSources(
    userId: string,
    sources: NewsSource[],
  ): Promise<Preference> {
    const preference = await this.findByUserId(userId);
    preference.sources = sources;
    return await this.preferenceRepository.save(preference);
  }

  async addSource(userId: string, newSource: NewsSource): Promise<Preference> {
    const preference = await this.findByUserId(userId);
    if (!preference.sources) {
      preference.sources = [];
    }
    preference.sources.push(newSource);
    return await this.preferenceRepository.save(preference);
  }

  async removeSource(
    userId: string,
    sourceToRemove: string,
  ): Promise<Preference> {
    const preference = await this.findByUserId(userId);
    if (!preference.sources) {
      throw new NotFoundException('No sources found');
    }
    preference.sources = preference.sources.filter(
      (source) => source.source !== sourceToRemove,
    );
    return await this.preferenceRepository.save(preference);
  }
}
