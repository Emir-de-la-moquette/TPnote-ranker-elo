import { Controller, Get, Param, Post, Body, Sse, HttpException } from '@nestjs/common';
import { /*RankingsService, */RankingsServiceDatabase } from './rankings.service';
import { Observable } from 'rxjs';

@Controller('api/ranking')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsServiceDatabase) {}

  // GET /ranking/health
  @Get('health')
  health() {
    return {
      Body : this.rankingsService.health()
    };
  }

  // GET /ranking
  @Get()
  async getAll() {
    const players = await this.rankingsService.getAll();

    if (!players || players.length==0){
      throw new HttpException(
          { success: false, message: "Le classement n'est pas disponible car aucun joueur n'existe" },
          404,
      );
    }
    else {
      return {
        success: true,
        Body : players
      };
    }
  }

  // GET /ranking/player?:playerId
  @Get('player/:playerId')
  async getElo(@Param('playerId') playerId: string) {
    const player = await this.rankingsService.get(playerId);
    if (!player) {
      return{
        success: false,
        info : `player ${playerId} not found`
      };
    }

    return {
      playerId,
      elo: player.elo
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

  @Sse('events')
  sse(): Observable<any>{
    return this.rankingsService.getUpdates()
  }

}
