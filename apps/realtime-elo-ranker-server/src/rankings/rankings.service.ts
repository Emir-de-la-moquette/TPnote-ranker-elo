import { Injectable } from '@nestjs/common';
import { PlayersService } from '../players/players.service'

export interface PlayerRanking {
  id: string;
  rank: number;
}

@Injectable()
export class RankingsService {
  // QuoiCouCache
  private rankingCache: Map<string, number> = new Map();

  // Get le classement mon reuf
  getAll(): PlayerRanking[] {
    return Array.from(this.rankingCache.entries()).map(([id, rank]) => ({
      id,
      rank,
    }));
  }

  // Update ou Add un player
  update(id: string, rank: number) {
    this.rankingCache.set(id, rank);
  }

  // Get le rank d'un player ma gueule
  get(id: string): number | undefined {
    return this.rankingCache.get(id);
  }
}


export class RankingsServiceDatabase {

    constructor(private playersService: PlayersService) {}

    getAll() { this.playersService.findAll() }

    get(id: string) { this.playersService.findById(id) }

    async update(id: string, rank: number) {
        await this.playersService.updateOrCreate(id, rank);
    }
    
}