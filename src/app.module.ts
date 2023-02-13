import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import AppConfig from './config/config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { CouponModule } from './coupon/coupon.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [AppConfig],
      isGlobal: true,
    }),
    AuthModule,
    NotificationModule,
    CouponModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
