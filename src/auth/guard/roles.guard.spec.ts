import { ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../../rol/entities/rols.enum';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const context = createMock<ExecutionContext>();
  const rolesResult = UserRole.MANAGER;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            constructor: jest.fn(),
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('Should be defined', () => {
    expect(guard).toBeDefined();
    expect(reflector).toBeDefined();
  });

  describe('canActivate', () => {
    describe('If roles is null', () => {
      it('Should return true', async () => {
        jest.spyOn(reflector, 'get').mockReturnValue(undefined);

        const result = await guard.canActivate(context);
        expect(result).toBe(true);
        expect(reflector.get).toBeCalled();
        expect(context.getHandler).toBeCalled();
      });
    });

    describe('If the role is set but role is not allowed', () => {
      const request = {
        user: { roles: [{ id: 1, rol: UserRole.DEVELOPER }] },
      };

      it('Should return false', async () => {
        jest.spyOn(reflector, 'get').mockReturnValue([rolesResult]);

        const httArgHost = createMock<HttpArgumentsHost>({
          getRequest: () => request,
        });
        context.switchToHttp.mockImplementation(() => httArgHost);
        const result = await guard.canActivate(context);
        expect(result).toBe(false);
      });
    });

    describe('If the role is set and role is allowed', () => {
      const request = {
        user: { roles: [{ id: 1, rol: rolesResult }] },
      };

      it('Should return true', async () => {
        jest.spyOn(reflector, 'get').mockReturnValue([rolesResult]);

        const httArgHost = createMock<HttpArgumentsHost>({
          getRequest: () => request,
        });
        context.switchToHttp.mockImplementation(() => httArgHost);

        const result = await guard.canActivate(context);
        expect(result).toBe(true);
      });
    });

    describe('If roles in user is undefined', () => {
      const request = {
        user: {},
      };

      it('Should return false', async () => {
        jest.spyOn(reflector, 'get').mockReturnValue([rolesResult]);

        const httArgHost = createMock<HttpArgumentsHost>({
          getRequest: () => request,
        });
        context.switchToHttp.mockImplementation(() => httArgHost);

        const result = await guard.canActivate(context);
        expect(result).toBe(false);
      });
    });
  });
});
