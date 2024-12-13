import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';

import { FirebaseAuthGuard } from '../core/guards/firebase-auth.guard';
import { PreferenceService } from './preference.service';
import { NewsSource } from './preference.entity';

@Controller('preferences')
@UseGuards(FirebaseAuthGuard)
export class PreferenceController {
  constructor(private readonly preferenceService: PreferenceService) {}

  @Get()
  async getPreferences(@Req() req) {
    return await this.preferenceService.findByUserId(req.user.uid);
  }

  @Put('api-key')
  async updateApiKey(@Req() req, @Body() body: { apiKey: string }) {
    return await this.preferenceService.updateApiKey(req.user.uid, body.apiKey);
  }

  @Put('sources')
  async updateSources(@Req() req, @Body() body: { sources: NewsSource[] }) {
    return await this.preferenceService.updateSources(
      req.user.uid,
      body.sources,
    );
  }

  @Post('sources')
  async addSource(@Req() req, @Body() newSource: NewsSource) {
    return await this.preferenceService.addSource(req.user.uid, newSource);
  }

  @Delete('sources/:source')
  async removeSource(@Req() req, @Param('source') source: string) {
    return await this.preferenceService.removeSource(req.user.uid, source);
  }
}
