import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 5000);
  //Включение валидации DTO
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    //Очистка валидируемого объекта от любых свойств, для которых нет декораторов валидации в DTO
    whitelist: true,
  }))
}
bootstrap();
