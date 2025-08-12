import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from './media.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseTestingModule } from '../../../test/mongo.testing.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaDbSchema, MediaDoc } from './media.schema';

describe('MediaService', () => {
  let service: MediaService;

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
      providers: [MediaService],
    }).compile();

    service = module.get<MediaService>(MediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
