import { Repository, SelectQueryBuilder } from 'typeorm';

export type MockRepository<T = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

export type MockSelectQueryBuilder<T = any> = Partial<
  Record<keyof SelectQueryBuilder<T>, jest.Mock>
>;

export const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  preload: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
  createQueryBuilder: jest.fn(),
});

export const createMockSelectQueryBuilder = <
  T = any,
>(): MockSelectQueryBuilder<T> => ({
  leftJoinAndSelect: jest.fn(),
  leftJoin: jest.fn(),
  where: jest.fn(),
  andWhere: jest.fn(),
  orderBy: jest.fn(),
  getMany: jest.fn(),
  getOne: jest.fn(),
  innerJoin: jest.fn(),
  innerJoinAndSelect: jest.fn(),
  addSelect: jest.fn(),
});
