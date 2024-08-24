import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccountGuard } from './auth/guards/account.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { MessageModule } from './message/message.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { Verification } from './verification/entities/verification.entity';
import { VerificationModule } from './verification/verification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Verification],
      synchronize: true, // for demo/development
    }),
    UsersModule,
    AuthModule,
    VerificationModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AccountGuard,
    },
  ],
})
export class AppModule {}
