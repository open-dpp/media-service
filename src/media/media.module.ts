import { Module } from '@nestjs/common';
import { MediaService } from './infrastructure/media.service';
import { ConfigModule } from '@nestjs/config';
import { MediaController } from './presentation/media.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaDbSchema, MediaDoc } from './infrastructure/media.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: MediaDoc.name,
        schema: MediaDbSchema,
      },
    ]),
  ],
  providers: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
