import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  createMockRepository,
  MockRepository,
} from '../utils/mocks/repository.mock';
import { Rol } from './entities/rol.entity';
import { RolService } from './rol.service';

describe('RolService', () => {
  let service: RolService;
  let repository: MockRepository;
  const mockRol: Rol = {
    rolId: 1,
    rol: 'rol',
    users: [],
  };
  const { rolId, ...dto } = mockRol;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolService,
        {
          provide: getRepositoryToken(Rol),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<RolService>(RolService);
    repository = module.get<MockRepository>(getRepositoryToken(Rol));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('Should create all user default rols', async () => {
      const expectedEntities: Rol[] = [];
      const expectedRols: Rol[] = [mockRol, mockRol, mockRol, mockRol];
      repository.find.mockReturnValue(expectedEntities);
      repository.save.mockReturnValue(mockRol);
      const roles = await service.onModuleInit();
      expect(roles).toEqual(expectedRols);
    });
  });

  describe('getRolesName', () => {
    it('Should return the rol name', () => {
      const { rol } = mockRol;
      const name = service.getRolName(mockRol);
      expect(name).toEqual(rol);
    });
  });

  describe('findOne', () => {
    describe('When rol exists', () => {
      it('Should return the rol', async () => {
        repository.findOne.mockReturnValue(mockRol);
        const rol = await service.findOne(rolId);
        expect(rol).toEqual(mockRol);
      });
    });

    describe('Otherwise', () => {
      it('Should throw a NotFound Exception', async () => {
        repository.findOne.mockReturnValue(undefined);
        try {
          await service.findOne(rolId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Rol with ID #${rolId} not found`);
        }
      });
    });
  });

  describe('remove', () => {
    it('Should remove the rol', async () => {
      repository.findOne.mockReturnValue(mockRol);
      const rol = await service.remove(rolId);
      expect(rol).toEqual(undefined);
    });
  });
});
