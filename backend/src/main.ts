import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
import * as YAML from 'yamljs';
import * as path from 'path';
import * as fs from 'fs';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'XSRF-TOKEN'],
    exposedHeaders: ['Content-Length', 'X-Custom-Header'],
  });

  app.use(
    csurf({
      cookie: {
        key: 'XSRF-TOKEN',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      },
    }),
  );

  app.use((req, res, next) => {
    res.cookie('XSRF-TOKEN', req.csrfToken(), {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
    next();
  });


    const yamlFile = fs.readFileSync(
      path.join(process.cwd(), 'swagger.yaml'),
      'utf8'
    );

    const document = YAML.parse(yamlFile);
    app.use('/', (req, res, next) => {
      if (req.url === '/') {
        res.redirect('/api-docs');
      } else {
        next();
      }
    });
  
    SwaggerModule.setup('api-docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
      useGlobalPrefix: false
    });

  await app.listen(3000);
}
bootstrap();
