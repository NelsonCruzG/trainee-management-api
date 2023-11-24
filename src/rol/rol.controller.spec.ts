import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockRepository } from '../utils/mocks/repository.mock';
import { Rol } from './entities/rol.entity';
import { RolController } from './rol.controller';
import { RolService } from './rol.service';

describe('RolController', () => {
  let controller: RolController;
  let service: RolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolController],
      providers: [
        RolService,
        {
          provide: getRepositoryToken(Rol),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    controller = module.get<RolController>(RolController);
    service = module.get<RolService>(RolService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});
