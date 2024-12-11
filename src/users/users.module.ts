import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, FirebaseService],
  controllers: [UsersController],
})
export class UsersModule {}
