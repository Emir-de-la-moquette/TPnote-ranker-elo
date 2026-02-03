import { Controller, Get, Param, Post, Body, HttpException } from '@nestjs/common';
import { MatchService} from './match.service';

@Controller('api/match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  // POST /match
  @Post()
  setElo(
      @Body() body: { winner: string, loser: string, draw: boolean },
  ) {
    const res = this.matchService.dudududuellll(body.winner, body.loser, body.draw);

    if (!res) {
        throw new HttpException(
            { success: false, message: "Soit le gagnant, soit le perdant indiqué n'existe pas" },
            422,
        );
    }

    const eloWin = res?.win;
    const eloLose = res?.lose;
    return { 
        success: true,
        body: {
            winner: {
                id: body.winner,
                rank: eloWin
            },
            loser: {
                id: body.loser,
                rank: eloLose
            }
        }
    };
  }


}
