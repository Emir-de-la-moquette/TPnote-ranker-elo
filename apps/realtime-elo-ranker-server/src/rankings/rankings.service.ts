import { Injectable } from '@nestjs/common';
import { PlayersService } from '../players/players.service'
import { map, Observable, Subject } from 'rxjs';

export interface PlayerRanking {
  id: string;
  rank: number;
}

@Injectable()
export class RankingsService {
  // QuoiCouCache
  private rankingCache: Map<string, number> = new Map();

  health() {return "not database"}

  // Get le classement mon reuf
  getAll(): PlayerRanking[] {
    return Array.from(this.rankingCache.entries()).map(([id, rank]) => ({
      id,
      rank,
    }));
  }

  // Get le rank d'un player ma gueule
  get(id: string): number | undefined {
    return this.rankingCache.get(id);
  }

  // Update ou Add un player
  update(id: string, rank: number) {
    this.rankingCache.set(id, rank);
  }
}

@Injectable()
export class RankingsServiceDatabase {

	private rankingCache: Map<string, number> = new Map();
	private rankingUpdates = new Subject<PlayerRanking>()

    constructor(
		private playersService: PlayersService,
    ) {}
    

    health() {this.playersService.health()}

    async getAll() { 
		const players = await this.playersService.findAll() 

		players.forEach(p => {
			this.rankingCache.set(p.id, p.elo);
		});
		return players;
	}

    async get(id: string): Promise<{ id: string; elo: number } | null> {
		const player = await this.playersService.findById(id);
		if (!player) return null;
		return player;
    }

    async update(id: string, rank: number) {
        await this.playersService.updateOrCreate(id, rank);
		this.rankingCache.set(id, rank);
		this.rankingUpdates.next({ id, rank });
    }

    getUpdates(): Observable<any> {
      return this.rankingUpdates.asObservable().pipe(
        map(player => ({ data: { type: 'RankingUpdate', player } }))
      );
    }
    
}