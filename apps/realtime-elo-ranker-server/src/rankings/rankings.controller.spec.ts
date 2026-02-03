import { Test, TestingModule } from '@nestjs/testing';
import { RankingsController } from './rankings.controller';
import { RankingsServiceDatabase } from './rankings.service';
import { of } from 'rxjs';

describe('RankingsController', () => {
  let controller: RankingsController;
  let service: RankingsServiceDatabase;

  const mockRankingsService = {
    health: jest.fn(),
    getAll: jest.fn(),
    get: jest.fn(),
    update: jest.fn(),
    getUpdates: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankingsController],
      providers: [
        {
          provide: RankingsServiceDatabase,
          useValue: mockRankingsService,
        },
      ],
    }).compile();

    controller = module.get(RankingsController);
    service = module.get(RankingsServiceDatabase);
  });

  it('should call health()', () => {
    controller.health();
    expect(service.health).toHaveBeenCalled();
  });

  it('should return all rankings', async () => {
    const players = [{ id: 'alice', elo: 1200 }];
    mockRankingsService.getAll.mockResolvedValue(players);

    const result = await controller.getAll();

    expect(result).toEqual(players);
    expect(service.getAll).toHaveBeenCalled();
  });

  it('should return elo for existing player', async () => {
    mockRankingsService.get.mockReturnValue({ id: 'alice', elo: 1200 });

    const result = await controller.getElo('alice');

    expect(result).toEqual({
      playerId: 'alice',
      elo: 1200,
    });
  });

  it('should return error if player not found', async () => {
    mockRankingsService.get.mockReturnValue(null);

    const result = await controller.getElo('bob');

    expect(result).toEqual({
      success: false,
      info: 'player bob not found',
    });
  });

  it('should update elo and return success', () => {
    const body = { playerId: 'alice', elo: 1300 };

    const result = controller.setElo(body);

    expect(service.update).toHaveBeenCalledWith('alice', 1300);
    expect(result).toEqual({ success: true });
  });

  it('should return SSE observable', () => {
    const mock$ = of({ data: 'test' });
    mockRankingsService.getUpdates.mockReturnValue(mock$);

    const result = controller.sse();

    expect(result).toBe(mock$);
  });
});
