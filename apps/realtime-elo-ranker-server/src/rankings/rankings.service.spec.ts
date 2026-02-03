import { Test, TestingModule } from '@nestjs/testing';
import { RankingsServiceDatabase } from './rankings.service';
import { PlayersService } from '../players/players.service';

describe('RankingsServiceDatabase', () => {
  let service: RankingsServiceDatabase;

  const mockPlayersService = {
    health: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    updateOrCreate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RankingsServiceDatabase,
        {
          provide: PlayersService,
          useValue: mockPlayersService,
        },
      ],
    }).compile();

    service = module.get(RankingsServiceDatabase);
  });

  it('should call playersService.health()', () => {
    service.health();
    expect(mockPlayersService.health).toHaveBeenCalled();
  });

  it('should return all players', async () => {
    const players = [{ id: 'alice', elo: 1200 }];
    mockPlayersService.findAll.mockResolvedValue(players);

    const result = await service.getAll();

    expect(result).toEqual(players);
    expect(mockPlayersService.findAll).toHaveBeenCalled();
  });

  it('should return player if found', () => {
    const player = { id: 'alice', elo: 1200 };
    mockPlayersService.findById.mockReturnValue(player);

    const result = service.get('alice');

    expect(result).toEqual(player);
  });

  it('should return null if player not found', () => {
    mockPlayersService.findById.mockReturnValue(null);

    const result = service.get('bob');

    expect(result).toBeNull();
  });

  it('should update player and emit ranking update', async () => {
    const spy = jest.fn();
    service.getUpdates().subscribe(spy);

    await service.update('alice', 1300);

    expect(mockPlayersService.updateOrCreate).toHaveBeenCalledWith('alice', 1300);
    expect(spy).toHaveBeenCalledWith({
      data: {
        type: 'RankingUpdate',
        player: { id: 'alice', rank: 1300 },
      },
    });
  });
});
