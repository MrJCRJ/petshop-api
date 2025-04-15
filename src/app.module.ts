import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from './clients/clients.module';
import { HealthModule } from './health/health.module';
import mongoose from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // Configurações do Mongoose
        mongoose.set('debug', true);
        mongoose.set('strictQuery', false);

        const uri = configService.get<string>('MONGODB_URI');
        if (!uri) {
          throw new Error('MONGODB_URI is not defined in configuration');
        }

        console.log(
          'Connecting to MongoDB with URI:',
          uri.length > 30 ? uri.substring(0, 30) + '...' : uri,
        );

        return {
          uri,
          retryAttempts: 5,
          retryDelay: 1000,
          serverSelectionTimeoutMS: 30000, // 30 segundos
          socketTimeoutMS: 45000, // 45 segundos
          connectTimeoutMS: 30000, // 30 segundos
          maxPoolSize: 10,
          minPoolSize: 2,
        };
      },
      inject: [ConfigService],
    }),
    ClientsModule,
    HealthModule,
  ],
})
export class AppModule {}
