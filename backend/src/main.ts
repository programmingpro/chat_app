import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get('PORT') || 3000;
  
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  
    // Serve static files
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
  
    // Настройка Swagger
    const config = new DocumentBuilder()
        .setTitle('Chat App API')
        .setDescription('API documentation for Chat App')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
  
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            withCredentials: true,
        },
    });

    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on: http://localhost:${port}`);
}
  
bootstrap();