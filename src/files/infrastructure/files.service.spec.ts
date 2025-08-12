import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseTestingModule } from '../../../test/mongo.testing.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaDbSchema, MediaDoc } from './media.schema';

describe('FilesService', () => {
  let service: FilesService;

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
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
