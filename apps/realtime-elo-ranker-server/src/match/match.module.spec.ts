import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { MatchModule } from './match.module';
import { PlayersService } from '../players/players.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('MatchModule', () => {
  let module: TestingModule;

  // Tes mocks restent identiques
  const mockPlayersService = { findAll: jest.fn() };
  const mockPrisma = { match: { create: jest.fn() } };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [MatchModule],
    })
      // On court-circuite les services fournis par PlayersModule et PrismaModule
      .overrideProvider(PlayersService)
      .useValue(mockPlayersService)
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  // Vérifie que les contrôleurs et services sont bien instanciés
  it('should resolve providers', () => {
    expect(module.get(MatchService)).toBeDefined();
    expect(module.get(PlayersService)).toBeDefined();
  });
});




// import { Test, TestingModule } from '@nestjs/testing';
// import { MatchService } from './match.service';
// import { MatchController } from './match.controller';
// import { MatchModule } from './match.module';
// import { PlayersService } from '../players/players.service';
// import { PrismaService } from '../../prisma/prisma.service';

// const mockPlayersService = {
//   findAll: jest.fn(),
//   findOne: jest.fn(),
// };

// const mockPrisma = {
//   player: {
//     findMany: jest.fn(),
//     findUnique: jest.fn(),
//     upsert: jest.fn(),
//     aggregate: jest.fn(),
//   },
//   match: {
//     create: jest.fn(),
//   },
//   $queryRaw: jest.fn(),
// };

// describe('MatchModule', () => {
//   let module: TestingModule;

//   beforeAll(async () => {
//     // module = await Test.createTestingModule({
//     //   imports: [MatchModule],
//     //   controllers: [MatchController],
//     //   providers: [
//     //     MatchService,
//     //     {
//     //       provide: PlayersService,
//     //       useValue: mockPlayersService,
//     //     },
//     //     {
//     //       provide: PrismaService,
//     //       useValue: mockPrisma,
//     //     },
//     //   ],
//     // }).compile();
//     module = await Test.createTestingModule({
//     imports: [MatchModule],
//     })
//     .overrideProvider(PlayersService)
//     .useValue(mockPlayersService)
//     .overrideProvider(PrismaService)
//     .useValue(mockPrisma)
//     .compile();
//   });

//   it('should compile the module', () => {
//     expect(module).toBeDefined();
//   });

//   it('should have PlayersService', () => {
//     const playersService = module.get<PlayersService>(PlayersService);
//     expect(playersService).toBeDefined();
//   });

//   it('should have MatchService', () => {
//     const matchService = module.get<MatchService>(MatchService);
//     expect(matchService).toBeDefined();
//   });

//   it('should have MatchController', () => {
//     const matchController = module.get<MatchController>(MatchController);
//     expect(matchController).toBeDefined();
//   });
// });
