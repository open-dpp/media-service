import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from '../infrastructure/files.service';
import { MongooseTestingModule } from '../../../test/mongo.testing.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaDbSchema, MediaDoc } from '../infrastructure/media.schema';
import { ConfigModule } from '@nestjs/config';

describe('FilesController', () => {
  let controller: FilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        MongooseTestingModule,
        MongooseModule.forFeature([
          {
            name: MediaDoc.name,
            schema: MediaDbSchema,
          },
        ]),
      ],
      providers: [FilesService],
      controllers: [FilesController],
    }).compile();

    controller = module.get<FilesController>(FilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
