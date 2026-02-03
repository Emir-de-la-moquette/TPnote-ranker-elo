import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as path from 'path';

@Injectable()
export class PlayersService {
  
	private rankingCache: Map<string, number> = new Map();

  constructor(private prisma: PrismaService) {}

  async health() {
    const tables = await this.prisma.$queryRaw<{ name: string }[]>`
      SELECT name FROM sqlite_master WHERE type='table';
    `;
    console.log(process.env.DATABASE_URL);
    console.log(tables);
    return {
      databaseUrl: process.env.DATABASE_URL,
      tables,
    };
  }


  async findAll() {

    let feur = await this.prisma.player.findMany();
    
		feur.forEach(p => {
			this.rankingCache.set(p.id, p.elo);
		});

    return feur;
  }

  findById(id: string): { id: string; elo: number } | null {
    // return this.prisma.player.findUnique({
    //   where: { id },
    // });
    let elo = this.rankingCache.get(id);
    if (elo)
    return {id, elo};
    return null;
  }

//   create(id: string, elo: number) {
//     return this.prisma.player.upsert({
//       data: { id, elo },
//     });
//   }

  async moyenneElo(): Promise<number> {
    const result = await this.prisma.player.aggregate({
      _avg: {
        elo: true,
      },
    });
    const avg = result._avg.elo ?? 400;
    return Math.round(avg);
  }


  updateOrCreate(id: string, elo: number) {
		this.rankingCache.set(id, elo);
    return this.prisma.player.upsert({
        create:{id, elo},
        update:{id, elo},
        where:{id}
    });
  }
}
