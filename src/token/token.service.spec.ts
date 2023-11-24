import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTokenDto } from '../auth/dto/create-token.dto';
import {
  MockRepository,
  createMockRepository,
} from '../utils/mocks/repository.mock';
import { Token } from './entities/token.entity';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;
  let repository: MockRepository;

  const mockToken: Token = {
    jti: 'fjsdkfsdkfkfskfj',
    exp: new Date(),
  };

  const dto: CreateTokenDto = {
    jti: mockToken.jti,
    exp: mockToken.exp.getDate(),
  };

  const jti = mockToken.jti;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: getRepositoryToken(Token),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    repository = module.get<MockRepository>(getRepositoryToken(Token));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('Shoul return a token', async () => {
      repository.findOne.mockReturnValue(mockToken);
      const token = await service.findOne(jti);
      expect(token).toEqual(mockToken);
    });
  });

  describe('create', () => {
    it('Should create and return a token', async () => {
      repository.create.mockReturnValue(mockToken);
      repository.save.mockReturnValue(mockToken);
      const token = await service.create(dto);
      expect(token).toEqual(mockToken);
    });
  });

  describe('deleteExpiredToken', () => {
    it('should delete a expired token', async () => {
      repository.delete.mockImplementation();
      await service.deleteExpiredToken();
      expect(repository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
