import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from '../../entities/Poll.entity';
import { User } from '../../entities/User.entity';
import { Event } from '../../entities/Event.entity';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, User, Event])],
  providers: [
    PollService,
    {
      provide: 'SOCKET_IO_SERVER',
      useFactory: () => (global as any).io || undefined,
    },
  ],
  controllers: [PollController],
  exports: [PollService, 'SOCKET_IO_SERVER'],
})
export class PollModule {} 