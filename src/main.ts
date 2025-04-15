import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import mongoose from 'mongoose';

async function bootstrap() {
  try {
    console.log('Starting application...');

    const app = await NestFactory.create(AppModule);

    // Configurações básicas
    app.use(helmet());
    app.enableCors();
    app.use(morgan('dev'));
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());

    // Configuração do Mongoose
    const mongooseConnection = mongoose.connection;

    mongooseConnection.on('connecting', () => {
      console.log('Connecting to MongoDB...');
    });

    mongooseConnection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
    });

    mongooseConnection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    // Inicia a aplicação
    await app.init();

    const port = process.env.PORT || 5001;
    await app.listen(port);
    console.log(`🚀 Application running on port ${port}`);
  } catch (err) {
    console.error('🔥 Application startup error:', err);
    process.exit(1);
  }
}

bootstrap();
