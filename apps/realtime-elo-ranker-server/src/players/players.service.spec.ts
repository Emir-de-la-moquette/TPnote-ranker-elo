import { Test, TestingModule } from '@nestjs/testing';
import { PlayersService } from './players.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('PlayersService', () => {
  let service: PlayersService;

  const mockPrisma = {
    player: {
      findMany: jest.fn(),
      aggregate: jest.fn(),
      upsert: jest.fn(),
    },
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get(PlayersService);
  });

  it('health() should return db info', async () => {
    mockPrisma.$queryRaw.mockResolvedValue([{ name: 'player' }]);
    const result = await service.health();

    expect(result.tables).toEqual([{ name: 'player' }]);
  });

  it('findAll() should populate rankingCache', async () => {
    const players = [{ id: 'alice', elo: 1200 }];
    mockPrisma.player.findMany.mockResolvedValue(players);

    const result = await service.findAll();

    expect(result).toEqual(players);
    expect(service.findById('alice')).toEqual({ id: 'alice', elo: 1200 });
  });

  it('findById() should return null if not found', () => {
    expect(service.findById('bob')).toBeNull();
  });

  it('moyenneElo() should return average elo', async () => {
    mockPrisma.player.aggregate.mockResolvedValue({ _avg: { elo: 1200 } });
    const avg = await service.moyenneElo();
    expect(avg).toBe(1200);
  });

  it('moyenneElo() should default to 400', async () => {
    mockPrisma.player.aggregate.mockResolvedValue({ _avg: { elo: null } });
    const avg = await service.moyenneElo();
    expect(avg).toBe(400);
  });

  it('updateOrCreate() should update cache and call upsert', async () => {
    mockPrisma.player.upsert.mockResolvedValue({ id: 'bob', elo: 1000 });

    const result = await service.updateOrCreate('bob', 1000);

    expect(service.findById('bob')).toEqual({ id: 'bob', elo: 1000 });
    expect(mockPrisma.player.upsert).toHaveBeenCalledWith({
      create: { id: 'bob', elo: 1000 },
      update: { id: 'bob', elo: 1000 },
      where: { id: 'bob' },
    });
    expect(result).toEqual({ id: 'bob', elo: 1000 });
  });
});
