import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GoogleGuard } from './google.guard';

describe('GoogleGuard', () => {
  let guard: GoogleGuard;

  const user = {};
  const err = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleGuard],
    })
      .overrideGuard(GoogleGuard)
      .useValue({ handleRequest: jest.fn() })
      .compile();

    guard = module.get<GoogleGuard>(GoogleGuard);
  });

  it('Should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('handleRequest', () => {
    describe('If err is null and user exists', () => {
      it('Should return the user', async () => {
        const userExpected = guard.handleRequest(undefined, user, {}, {}, {});
        expect(userExpected).toBe(user);
      });
    });

    describe('If err is not null and user exists', () => {
      it('Should throw a BabRequestException', async () => {
        try {
          guard.handleRequest(err, user, {}, {}, {});
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
        }
      });
    });

    describe('If err is null and user is null', () => {
      it('Should throw a BabRequestException', async () => {
        try {
          guard.handleRequest(undefined, undefined, {}, {}, {});
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
        }
      });
    });

    describe('If err is not null and user is null', () => {
      it('Should throw a BabRequestException', async () => {
        try {
          guard.handleRequest(err, undefined, {}, {}, {});
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
        }
      });
    });
  });
});
