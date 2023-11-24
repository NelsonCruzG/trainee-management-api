import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { Token } from '../token/entities/token.entity';
import { AuthService } from './auth.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { createMockRepository } from '../utils/mocks/repository.mock';
import { TokenService } from '../token/token.service';
import { JwtService } from '@nestjs/jwt';
import { mockUser } from '../utils/mocks/user.mock';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let tokenService: TokenService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockToken: Token = {
    jti: 'fjsdkfsdkfkfskfj',
    exp: new Date(),
  };

  const dto: CreateTokenDto = {
    jti: mockToken.jti,
    exp: mockToken.exp.getDate(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: { findOneByEmail: jest.fn() },
        },
        {
          provide: TokenService,
          useValue: createMockRepository(),
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    tokenService = module.get<TokenService>(TokenService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(tokenService).toBeDefined();
    expect(userService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('generateToken', () => {
    const expected = 'asjskdkfkfdkf';

    it('Should generate a json web token', async () => {
      jest.spyOn(jwtService, 'sign').mockImplementation(() => expected);
      const expectedToken = service.generateToken(mockUser);
      expect(expectedToken).toEqual({
        accessToken: expected,
      });
    });
  });

  describe('logIn', () => {
    const email = 'myemail@email.com';

    describe('If email already exists', () => {
      it('should return a token for authentication', async () => {
        jest
          .spyOn(userService, 'findOneByEmail')
          .mockImplementation(async () => mockUser);

        const expectedToken = await service.logIn(email);
        const token = service.generateToken(mockUser);

        expect(expectedToken).toEqual(token);
      });
    });

    describe('If email not exists', () => {
      it('Should throw a UnauthorizedException', async () => {
        jest
          .spyOn(userService, 'findOneByEmail')
          .mockImplementation(async () => undefined);
        try {
          await service.logIn(email);
        } catch (err) {
          expect(err).toBeInstanceOf(UnauthorizedException);
          expect(err.message).toEqual(
            `User ${email} does not have a linked account`,
          );
        }
      });
    });
  });

  describe('validateToken', () => {
    const email = 'myemail@email.com';
    const jti = 'fjsdkfsdkfkfskfj';

    describe('If user already exists and token not exists', () => {
      it('Should return a existing user', async () => {
        jest
          .spyOn(userService, 'findOneByEmail')
          .mockImplementation(async () => mockUser);

        jest
          .spyOn(tokenService, 'findOne')
          .mockImplementation(async () => undefined);

        const expectedUser = await service.validateToken(email, jti);
        expect(expectedUser).toEqual(mockUser);
      });
    });

    describe('If user not exists or token not exists', () => {
      it('Should throw a UnauthorizedException', async () => {
        jest
          .spyOn(userService, 'findOneByEmail')
          .mockImplementation(async () => undefined);

        jest
          .spyOn(tokenService, 'findOne')
          .mockImplementation(async () => undefined);

        try {
          await service.validateToken(email, jti);
        } catch (err) {
          expect(err).toBeInstanceOf(UnauthorizedException);
        }
      });
    });

    describe('If user already exists or token already exists', () => {
      it('Should throw a UnauthorizedException', async () => {
        jest
          .spyOn(userService, 'findOneByEmail')
          .mockImplementation(async () => mockUser);

        jest
          .spyOn(tokenService, 'findOne')
          .mockImplementation(async () => mockToken);

        try {
          await service.validateToken(email, jti);
        } catch (err) {
          expect(err).toBeInstanceOf(UnauthorizedException);
        }
      });
    });

    describe('If user not exists or token already exists', () => {
      it('Should throw a UnauthorizedException', async () => {
        jest
          .spyOn(userService, 'findOneByEmail')
          .mockImplementation(async () => undefined);

        jest
          .spyOn(tokenService, 'findOne')
          .mockImplementation(async () => mockToken);

        try {
          await service.validateToken(email, jti);
        } catch (err) {
          expect(err).toBeInstanceOf(UnauthorizedException);
        }
      });
    });
  });

  describe('logOut', () => {
    describe('If token was saved', () => {
      it('Should return a successful message', async () => {
        const message = 'Logged out successfully';
        jest
          .spyOn(tokenService, 'create')
          .mockImplementation(async () => mockToken);

        const expectedMessage = await service.logOut(dto);
        expect(expectedMessage).toEqual({ info: message });
      });
    });
    describe('If token was not saved', () => {
      it('Should throw a InternalServerError', async () => {
        jest
          .spyOn(tokenService, 'create')
          .mockImplementation(async () => undefined);

        try {
          await service.logOut(dto);
        } catch (err) {
          expect(err).toBeInstanceOf(InternalServerErrorException);
        }
      });
    });
  });
});
