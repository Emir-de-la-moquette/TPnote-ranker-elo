import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { PlayersModule } from '../players/players.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PlayersModule, PrismaModule],
  providers: [MatchService],
  controllers: [MatchController]
})
export class MatchModule {}