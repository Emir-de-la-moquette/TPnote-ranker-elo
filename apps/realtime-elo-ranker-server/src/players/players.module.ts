import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PlayersService],
  exports: [PlayersService],
})
export class PlayersModule {}
