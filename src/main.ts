import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import {
  NotFoundExceptionFilter,
  NotFoundInDatabaseExceptionFilter,
  ValueErrorFilter,
} from './exceptions/exception.handler';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalFilters(
    new NotFoundInDatabaseExceptionFilter(),
    new NotFoundExceptionFilter(),
    new ValueErrorFilter(),
  );
  app.enableCors({
    origin: '*',
  });
  app.use(
    '/media/upload-dpp-file/:upi',
    bodyParser.urlencoded({ limit: '50mb', extended: true }),
  );
  const port = Number(configService.get('PORT', '3004'));
  console.log(`Listening on port ${port}`);
  await app.listen(port, '0.0.0.0');
}

if (require.main === module) {
  bootstrap();
}
