import { Module } from '@nestjs/common';
import { RankingsService, RankingsServiceDatabase } from './rankings.service';
import { RankingsController } from './rankings.controller';

@Module({
  providers: [RankingsService],
  controllers: [RankingsController]
})
export class RankingsModule {}

@Module({
  providers: [RankingsServiceDatabase],
  controllers: [RankingsController]
})
export class RankingsModuleDatabase {}
