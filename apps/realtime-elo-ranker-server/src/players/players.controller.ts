import { Body, Controller, Post } from '@nestjs/common';
import { PlayersService } from './players.service';

@Controller('api/player')
export class PlayersController {
    constructor(private readonly playersService:    PlayersService) {}

    // POST /player
    @Post()
    async createPlayer(
        @Body() body: { playerId: string },
    ) {
        const p = await this.playersService.findById(body.playerId)
        if (p) { return {success: false, info:"player already exists"}}
        
        const elo = await this.playersService.moyenneElo()
        this.playersService.updateOrCreate(body.playerId, elo);
        return { success: true };
    }
}
