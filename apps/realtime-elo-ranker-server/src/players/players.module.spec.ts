import { Test, TestingModule } from '@nestjs/testing';
import { PlayersModule } from './players.module';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { PrismaService } from '../../prisma/prisma.service';

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

describe('Module Tests', () => {

  describe('PlayersModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
      module = await Test.createTestingModule({
        imports: [PlayersModule],
      })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();
    });

    it('should compile PlayersModule', () => {
      expect(module).toBeDefined();
    });

    it('should have PlayersService', () => {
      const service = module.get<PlayersService>(PlayersService);
      expect(service).toBeDefined();
    });

    it('should have PlayersController', () => {
      const controller = module.get<PlayersController>(PlayersController);
      expect(controller).toBeDefined();
    });
  });
})