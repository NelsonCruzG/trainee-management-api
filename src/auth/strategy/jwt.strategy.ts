import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { IUserPayloadToken } from '../interface/user-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService, private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: IUserPayloadToken) {
    const userExist = await this.authService.validateToken(
      payload.email,
      payload.jti,
    );

    const user: IUserPayloadToken = {
      sub: userExist.userId,
      email: userExist.email,
      roles: userExist.roles,
      jti: payload.jti,
      exp: payload.exp,
    };

    return user;
  }
}
