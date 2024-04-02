import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { HelperService } from './helper.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_EXPIRE_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [HelperService],
})
export class HelperModule {}
