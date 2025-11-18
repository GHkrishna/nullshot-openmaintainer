import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 'api' is the path where Swagger UI will be available

  app.enableCors({
    origin: '*',     // or ['http://localhost:5173']
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: '*',
    credentials: false,
  });


  await app.listen(3000); // Or your desired port
}
bootstrap();