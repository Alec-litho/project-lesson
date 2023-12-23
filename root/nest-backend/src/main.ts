import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cors from "cors";
import * as cookieParser from 'cookie-parser';
// const cordConfig = {
//   origin: "http://localhost:300",
//   credentials: true,
//   allowedHeaders: 'Content-Type, Accept, Origin',
//   preflightContinue: false,
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
// }
async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  // app.use(cookieParser);
  app.use(cors());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const config = new DocumentBuilder()
    .setTitle("social site API")
    .setDescription("the API for social site")
    .setVersion('1.0.0')
    .addTag("tag")
    .build()
  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('/app/docs', app, document)
  await app.listen(3001);
  
}
bootstrap();
