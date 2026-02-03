import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { PlayersController } from './players.controller';

@Module({
  imports: [PrismaModule],
  providers: [PlayersService],
  controllers: [PlayersController],
  exports: [PlayersService],
})
export class PlayersModule {}
