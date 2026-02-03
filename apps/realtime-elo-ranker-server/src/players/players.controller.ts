import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { PlayersService } from './players.service';

@Controller('api/player')
export class PlayersController {
    constructor(private readonly playersService:    PlayersService) {}

    // POST /player
    @Post()
    async createPlayer(
        @Body() body: { playerId: string },
    ) {

        if (!body.playerId || typeof body.playerId !== 'string') {
            throw new HttpException(
                { success: false, message: "L'identifiant du joueur n'est pas valide" },
                400,
            );
        }

        const p = await this.playersService.findById(body.playerId)
        if (p) {
            throw new HttpException(
                {success: false, info:"player already exists"},
                409,
            );
        }

        const elo = await this.playersService.moyenneElo()
        this.playersService.updateOrCreate(body.playerId, elo);
        return { 
            success: true,
            body: {
                playerId: body.playerId,
                rank: elo,
            },
         };
    }
}
