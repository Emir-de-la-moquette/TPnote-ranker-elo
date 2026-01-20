import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RankingsModule } from './rankings/rankings.module';
import { PlayersService } from './players/players.service';
import { PlayersController } from './players/players.controller';

@Module({
  imports: [RankingsModule],
  controllers: [AppController, PlayersController],
  providers: [AppService, PlayersService],
})
export class AppModule {}
