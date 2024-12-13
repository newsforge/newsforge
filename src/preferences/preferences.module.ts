import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { FirebaseService } from '../core/services/firebase.service';
import { PreferenceController } from './preference.controller';
import { PreferenceService } from './preference.service';
import { Preference } from './preference.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Preference])],
  providers: [PreferenceService, FirebaseService],
  controllers: [PreferenceController],
})
export class PreferencesModule {}
