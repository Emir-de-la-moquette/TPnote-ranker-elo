import { Injectable } from '@nestjs/common';
import { PlayersService } from '../players/players.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MatchService {

    constructor(
        private playersService: PlayersService,
        private prisma: PrismaService
    ) {}


  // Réalise un match en mettant à jour les elo
  dudududuellll(winner: string, loser: string, draw: boolean) {
    const K = 32;

    const eloWinner = this.playersService.findById(winner)?.elo ?? -1;
    const eloLoser = this.playersService.findById(loser)?.elo ?? -1;

    if( eloLoser<0 || eloWinner<0) {
        return null;
    }

    // Probabilités de victoire (We)
    const weWinner = 1 / (1 + Math.pow(10, (eloLoser - eloWinner) / 400));
    const weLoser = 1 / (1 + Math.pow(10, (eloWinner - eloLoser) / 400));

    // Résultat du match (W)
    const wWinner = draw ? 0.5 : 1;
    const wLoser = draw ? 0.5 : 0;

    // Nouveaux elo (Rn)
    let newEloWinner = eloWinner + K * (wWinner - weWinner);
    let newEloLoser = eloLoser + K * (wLoser - weLoser);

    if (newEloLoser<0){
        newEloLoser = 0;
    }

    // update
    this.playersService.updateOrCreate(winner, Math.round(newEloWinner));
    this.playersService.updateOrCreate(loser, Math.round(newEloLoser));

    // historique bd
    this.prisma.match.create({
        data: {
            winner: winner,
            loser: loser,
        },
    });

    return {win: newEloWinner, lose: newEloLoser}
  }
}
