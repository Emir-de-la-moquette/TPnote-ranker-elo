import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

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
