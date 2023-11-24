import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateTokenDto } from './dto/create-token.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const email = 'myemail@email.com';
  const dto: CreateTokenDto = {
    jti: 'fggfdgsd.jti',
    exp: new Date().getDate(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue({
        logIn: jest.fn(),
        logOut: jest.fn(),
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('login', () => {
    const token = 'akdkfdsfkaskf';
    const expected = {
      accessToken: token,
    };
    it('Should login a user and return an access token', async () => {
      jest.spyOn(service, 'logIn').mockImplementation(async () => expected);
      expect(await controller.login(email)).toBe(expected);
    });
  });

  describe('logout', () => {
    const message = 'Logged out successfully';
    const expected = { info: message };

    it('Should logout a user and return a successful message', async () => {
      jest.spyOn(service, 'logOut').mockImplementation(async () => expected);
      expect(await controller.logout(dto)).toBe(expected);
    });
  });

  describe('googleAuth', () => {
    it('Should redirect to Google OAuth', async () => {
      expect(await controller.googleAuth()).toEqual(undefined);
    });
  });
});
