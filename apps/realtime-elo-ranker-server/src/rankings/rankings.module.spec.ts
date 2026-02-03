import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { RankingsServiceDatabase } from './rankings.service';
import { RankingsController } from './rankings.controller';
import { RankingsModule } from './rankings.module';

const mockPrisma = {
  player: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    upsert: jest.fn(),
    aggregate: jest.fn(),
  },
  match: {
    create: jest.fn(),
  },
  $queryRaw: jest.fn(),
};


describe('RankingsModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
      module = await Test.createTestingModule({
        imports: [RankingsModule],
      })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();
    });

    it('should compile RankingsModule', () => {
      expect(module).toBeDefined();
    });

    it('should have RankingsServiceDatabase', () => {
      const service = module.get<RankingsServiceDatabase>(RankingsServiceDatabase);
      expect(service).toBeDefined();
    });

    it('should have RankingsController', () => {
      const controller = module.get<RankingsController>(RankingsController);
      expect(controller).toBeDefined();
    });
  });
