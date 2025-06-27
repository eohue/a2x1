import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from '../../../apps/api-gateway/src/modules/user/user.controller';

@Module({
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {} 