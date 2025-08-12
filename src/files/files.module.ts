import { Module } from '@nestjs/common';
import { FilesService } from './infrastructure/files.service';
import { ConfigModule } from '@nestjs/config';
import { FilesController } from './presentation/files.controller';
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
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
