import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

describe('MatchController', () => {
  let controller: MatchController;
  let service: MatchService;

  const mockMatchService = {
    dudududuellll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [
        { provide: MatchService, useValue: mockMatchService },
      ],
    }).compile();

    controller = module.get(MatchController);
    service = module.get(MatchService);
  });

  it('should return updated elo after match', () => {
    mockMatchService.dudududuellll.mockReturnValue({
      win: 1200,
      lose: 1000,
    });

    const body = { winner: 'alice', loser: 'bob', draw: false };
    const result = controller.setElo(body);

    expect(result).toEqual({
      success: true,
      body: {
        winner: { id: 'alice', rank: 1200 },
        loser: { id: 'bob', rank: 1000 },
      },
    });

    expect(service.dudududuellll).toHaveBeenCalledWith('alice', 'bob', false);
  });

  it('should handle draw', () => {
    mockMatchService.dudududuellll.mockReturnValue({
      win: 1150,
      lose: 1150,
    });

    const body = { winner: 'alice', loser: 'bob', draw: true };
    const result = controller.setElo(body);

    expect(result.body.winner.rank).toBe(1150);
    expect(result.body.loser.rank).toBe(1150);
    expect(service.dudududuellll).toHaveBeenCalledWith('alice', 'bob', true);
  });

  it('should handle null return from service', () => {
    mockMatchService.dudududuellll.mockReturnValue(null);

    const body = { winner: 'unknown', loser: 'bob', draw: false };
    const result = controller.setElo(body);

    // Controller retourne toujours success: true mais win/lose seront undefined
    expect(result).toEqual({
      success: true,
      body: {
        winner: { id: 'unknown', rank: undefined },
        loser: { id: 'bob', rank: undefined },
      },
    });
  });
});
