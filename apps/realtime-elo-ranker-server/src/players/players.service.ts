import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as path from 'path';

@Injectable()
export class PlayersService {
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


  findAll() {
    return this.prisma.player.findMany();
  }

  findById(id: string): Promise<{ id: string; elo: number } | null> {
    return this.prisma.player.findUnique({
      where: { id },
    });
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
    const avg = result._avg.elo ?? 800; // j'ai mis 800 car je crois c'est l'elo de base aux echecs
    return Math.round(avg);
  }


  updateOrCreate(id: string, elo: number) {
    return this.prisma.player.upsert({
        create:{id, elo},
        update:{id, elo},
        where:{id}
    });
  }
}
