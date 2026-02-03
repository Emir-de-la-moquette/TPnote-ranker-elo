import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import { PlayersService } from '../players/players.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('MatchService', () => {
  let service: MatchService;
  let playersService: PlayersService;
  let prisma: PrismaService;

  const mockPlayersService = {
    findById: jest.fn(),
    updateOrCreate: jest.fn(),
  };

  const mockPrismaService = {
    match: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        { provide: PlayersService, useValue: mockPlayersService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get(MatchService);
    playersService = module.get(PlayersService);
    prisma = module.get(PrismaService);
  });

  it('should calculate elo after a win', () => {
    mockPlayersService.findById.mockReturnValueOnce({ id: 'alice', elo: 1200 })
                                  .mockReturnValueOnce({ id: 'bob', elo: 1000 });

    mockPlayersService.updateOrCreate.mockImplementation(() => {});

    const result = service.dudududuellll('alice', 'bob', false);

    expect(result?.win).toBeGreaterThan(1200);
    expect(result?.lose).toBeLessThan(1000);

    expect(playersService.updateOrCreate).toHaveBeenCalledTimes(2);
    expect(prisma.match.create).toHaveBeenCalledWith({
      data: { winner: 'alice', loser: 'bob' },
    });
  });

  it('should calculate elo after a draw', () => {
    mockPlayersService.findById.mockReturnValueOnce({ id: 'alice', elo: 1200 })
                                  .mockReturnValueOnce({ id: 'bob', elo: 1000 });

    const result = service.dudududuellll('alice', 'bob', true);

    expect(result?.win).toBeLessThan(1200); // Elo gagnant monte moins
    expect(result?.lose).toBeGreaterThan(1000); // Elo perdant monte

    expect(playersService.updateOrCreate).toHaveBeenCalledTimes(4);
  });

  it('should return null if player not found', () => {
    mockPlayersService.findById.mockReturnValueOnce(null)
                                .mockReturnValueOnce({ id: 'bob', elo: 1000 });

    const result = service.dudududuellll('unknown', 'bob', false);
    expect(result).toBeNull();
  });

  it('should clamp elo to zero', () => {
    mockPlayersService.findById.mockReturnValueOnce({ id: 'loser', elo: 0 })
                                .mockReturnValueOnce({ id: 'winner', elo: 400 });

    const result = service.dudududuellll('winner', 'loser', false);

    expect(result?.lose).toBeGreaterThanOrEqual(0);
  });
});
