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

    // Configuração explícita para o Render
    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
      abortOnError: false,
    });

    // Configurações de segurança e logging
    app.use(helmet());
    app.enableCors({
      origin: process.env.CORS_ORIGIN || '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    app.use(morgan('combined'));
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    // Configuração robusta do Mongoose
    mongoose.set('debug', process.env.NODE_ENV !== 'production');
    mongoose.set('strictQuery', false);

    const mongooseConnection = mongoose.connection;

    mongooseConnection.on('connecting', () => {
      console.log('Connecting to MongoDB...');
    });

    mongooseConnection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
    });

    mongooseConnection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      process.exit(1); // Encerra a aplicação em caso de erro de conexão
    });

    // Conexão com tratamento de timeout
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/petshop',
      {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
      },
    );

    // Inicialização do servidor
    const port = parseInt(process.env.PORT || '5001', 10);
    await app.listen(port, '0.0.0.0'); // Importante para o Render

    console.log(`🚀 Application running on port ${port}`);
    console.log(
      `🛡️  CORS enabled for: ${process.env.CORS_ORIGIN || 'all origins'}`,
    );
  } catch (err) {
    console.error('🔥 Application startup error:', err);
    process.exit(1);
  }
}

bootstrap();
