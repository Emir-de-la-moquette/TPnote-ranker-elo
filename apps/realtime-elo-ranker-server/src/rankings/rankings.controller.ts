import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { RankingsService, RankingsServiceDatabase } from './rankings.service';

@Controller('api/ranking')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsServiceDatabase) {}

  // GET /ranking
  @Get('health')
  health() {
    return this.rankingsService.health();
  }

  // GET /ranking
  @Get()
  getAll() {
    return this.rankingsService.getAll();
  }

  // GET /ranking/:playerId
  @Get(':playerId')
  getElo(@Param('playerId') playerId: string) {
    return {
      playerId,
      elo: this.rankingsService.get(playerId),
    };
  }

  // POST /ranking
  @Post()
  setElo(
            @Body() body: { playerId: string, elo: number },
        ) {
    this.rankingsService.update(body.playerId, body.elo);
    return { success: true };
  }
}
