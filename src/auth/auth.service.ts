import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/users.entity';
import { UserService } from '../user/user.service';
import * as uuid from 'uuid';
import { TokenService } from '../token/token.service';
import { CreateTokenDto } from './dto/create-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * @param user for the payload
   * @returns a new access token with a random jti
   */
  generateToken(user: User) {
    const payload = {
      sub: user.userId,
      email: user.email,
      roles: user.roles,
      jti: uuid.v4(),
    };
    return { accessToken: this.jwtService.sign(payload) };
  }

  /**
   * @param email to search a user by email
   * @returns an access token
   */
  async logIn(email: string) {
    const userExist = await this.userService.findOneByEmail(email);

    if (!userExist)
      throw new UnauthorizedException(
        `User ${email} does not have a linked account`,
      );

    return this.generateToken(userExist);
  }

  /**
   * @param email if the user was not delete
   * @param jti if the jti was not revoked
   * @returns user for payload
   */
  async validateToken(email: string, jti: string) {
    const userExist = await this.userService.findOneByEmail(email);
    const tokenExist = await this.tokenService.findOne(jti);

    if (!userExist || tokenExist) throw new UnauthorizedException();

    return userExist;
  }

  /**
   * @param jti to revoke a token
   * @returns a successfully message
   */
  async logOut(token: CreateTokenDto) {
    const tokenSaved = await this.tokenService.create(token);
    if (!tokenSaved) throw new InternalServerErrorException();
    const message = 'Logged out successfully';
    return { info: message };
  }
}
