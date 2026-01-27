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

  findById(id: string) {
    return this.prisma.player.findUnique({
      where: { id },
    });
  }

//   create(id: string, elo: number) {
//     return this.prisma.player.upsert({
//       data: { id, elo },
//     });
//   }

  updateOrCreate(id: string, elo: number) {
    return this.prisma.player.upsert({
        create:{id, elo},
        update:{id, elo},
        where:{id}
    });
  }
}
