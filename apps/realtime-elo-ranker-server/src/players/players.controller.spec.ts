import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

describe('PlayersController', () => {
  let controller: PlayersController;
  let service: PlayersService;

  const mockPlayersService = {
    findById: jest.fn(),
    moyenneElo: jest.fn(),
    updateOrCreate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [
        { provide: PlayersService, useValue: mockPlayersService },
      ],
    }).compile();

    controller = module.get(PlayersController);
    service = module.get(PlayersService);
  });

  it('should return error if player exists', async () => {
    mockPlayersService.findById.mockReturnValue({ id: 'alice', elo: 1200 });

    const result = await controller.createPlayer({ playerId: 'alice' });

    expect(result).toEqual({ success: false, info: 'player already exists' });
    expect(mockPlayersService.findById).toHaveBeenCalledWith('alice');
  });

  it('should create a new player if not exists', async () => {
    mockPlayersService.findById.mockReturnValue(null);
    mockPlayersService.moyenneElo.mockResolvedValue(1000);
    mockPlayersService.updateOrCreate.mockResolvedValue({ id: 'bob', elo: 1000 });

    const result = await controller.createPlayer({ playerId: 'bob' });

    expect(mockPlayersService.findById).toHaveBeenCalledWith('bob');
    expect(mockPlayersService.moyenneElo).toHaveBeenCalled();
    expect(mockPlayersService.updateOrCreate).toHaveBeenCalledWith('bob', 1000);
    expect(result).toEqual({ success: true });
  });
});
