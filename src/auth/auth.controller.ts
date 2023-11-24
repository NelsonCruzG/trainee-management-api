import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { User } from './decorator/user.decorator';
import { CreateTokenDto } from './dto/create-token.dto';
import { GoogleGuard } from './guard/google.guard';
import { JwtGuard } from './guard/jwt.guard';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(GoogleGuard)
  @Get('auth/google/callback')
  login(@User('email') email: string) {
    return this.authService.logIn(email);
  }

  @UseGuards(GoogleGuard)
  @Get('login')
  async googleAuth() {
    //because it does the callback
  }

  @UseGuards(JwtGuard)
  @Get('logout')
  logout(@User() token: CreateTokenDto) {
    return this.authService.logOut(token);
  }
}
