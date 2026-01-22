import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  async health() {
    const res = await this.prisma.$queryRaw<{name: string}[]>`
      SELECT name FROM sqlite_master WHERE type='table';
    `;
    console.log(res);
    console.log(this.prisma);
    return res;
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
