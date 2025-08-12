import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { VirusScanFileValidator } from './virus-scan.file-validator';
import { AuthRequest } from '../../auth/auth-request';
import { MediaService } from '../infrastructure/media.service';
import { Response } from 'express';
import { Media } from '../domain/media';

@Controller('media')
export class MediaController {
  constructor(private readonly filesService: MediaService) {}

  @Post('profileImage')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async uploadProfileImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 10 * 1024 * 1024 /* max 10MB */,
          }),
          new FileTypeValidator({
            fileType: /(image\/(jpeg|jpg|png|heic|webp))$/,
          }),
          new VirusScanFileValidator({ storageType: 'memory' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: AuthRequest,
  ): Promise<void> {
    await this.filesService.uploadProfilePicture(
      file.buffer,
      req.authContext.keycloakUser.sub,
    );
  }

  @Post('dpp/:orgId/:upi/:dataFieldId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async uploadDppFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 15 * 1024 * 1024 /* max 15MB */,
          }),
          new FileTypeValidator({
            fileType: /(image\/(jpeg|jpg|png|heic|webp)|application\/pdf)$/,
          }),
          new VirusScanFileValidator({ storageType: 'memory' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('orgId') orgId: string,
    @Param('upi') upi: string,
    @Param('dataFieldId') dataFieldId: string,
    @Req() req: AuthRequest,
  ): Promise<{
    mediaId: string;
  }> {
    const media = await this.filesService.uploadFileOfProductPassport(
      file.originalname,
      file.buffer,
      dataFieldId,
      upi,
      req.authContext.keycloakUser.sub,
      orgId,
    );
    return {
      mediaId: media.id,
    };
  }

  @Get('dpp/:upi/:dataFieldId/info')
  async getDppFileInfo(
    @Param('upi') upi: string,
    @Param('dataFieldId') dataFieldId: string,
  ): Promise<Media> {
    return this.filesService.findOneDppFileOrFail(dataFieldId, upi);
  }

  @Get('dpp/:upi/:dataFieldId/download')
  async streamDppFile(
    @Param('upi') upi: string,
    @Param('dataFieldId') dataFieldId: string,
    @Req() req: AuthRequest,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const result = await this.filesService.getFilestreamOfProductPassport(
        dataFieldId,
        upi,
      );
      res.setHeader('Content-Type', result.media.mimeType);
      res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
      res.setHeader('Last-Modified', result.media.updatedAt.toUTCString());
      // res.setHeader('Cache-Control', 'private, max-age=31536000');
      result.stream.pipe(res);
      result.stream.on('error', (error) => {
        console.error('Stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to retrieve file' });
        }
      });
    } catch (error) {
      console.error('Error getting file:', error);
      res.status(404).json({ error: 'File not found' });
    }
  }
}
