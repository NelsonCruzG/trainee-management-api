import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategy/google.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [
    PassportModule,
    UserModule,
    TokenModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [GoogleStrategy, JwtStrategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
