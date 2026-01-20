import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { RankingsService } from './rankings.service';

@Controller('rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  // GET /rankings
  @Get()
  getAll() {
    return this.rankingsService.getAll();
  }

  // GET /rankings/:playerId
  @Get(':playerId')
  getElo(@Param('playerId') playerId: string) {
    return {
      playerId,
      elo: this.rankingsService.get(playerId),
    };
  }

  // POST /rankings
  @Post()
  setElo(
            @Body() body: { playerId: string, elo: number },
        ) {
    this.rankingsService.update(body.playerId, body.elo);
    return { success: true };
  }
}
