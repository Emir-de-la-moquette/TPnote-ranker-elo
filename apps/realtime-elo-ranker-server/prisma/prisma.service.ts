import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/client';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {

  constructor() {
    const dbPath = join(process.cwd(), 'prisma', 'eloRanker.db');
    
    const dir = join(process.cwd(), 'prisma');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    super({
      datasources: {
        db: {
          url: `file:${dbPath}`,
        },
      },
    });
  }

  async onModuleInit() {
    console.log("CWD:", process.cwd());
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}