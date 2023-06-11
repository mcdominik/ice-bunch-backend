import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule.forRoot({}));
  const config = new DocumentBuilder().setTitle('icebunch').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.enableCors({origin: [
    'https://icebunch-frontend.vercel.app',
    'https://icebunch.com',
    'www.icebunch.com'
  ]});
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (e) => {
        throw new BadRequestException(e);
      },
    }),
  );
  await app.listen(3002);
}
bootstrap();
