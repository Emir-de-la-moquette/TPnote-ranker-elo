import { Module } from '@nestjs/common';
import { RankingsService, RankingsServiceDatabase } from './rankings.service';
import { RankingsController } from './rankings.controller';
import { PlayersModule } from '../players/players.module';

@Module({
  imports: [PlayersModule],
  providers: [RankingsService, RankingsServiceDatabase],
  controllers: [RankingsController]
})
export class RankingsModule {}

// @Module({
//   providers: [RankingsServiceDatabase],
//   controllers: [RankingsController]
// })
// export class RankingsModuleDatabase {}
