import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTokenDto } from '../auth/dto/create-token.dto';
import { LessThan, Repository } from 'typeorm';
import { Token } from './entities/token.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
  ) {}

  /**
   * @param jti get one token by jti
   * @returns a token id
   */
  findOne(jti: string): Promise<Token> {
    return this.tokenRepository.findOne(jti);
  }

  /**
   * @param jti to save a token id
   * @returns the new token id saved
   */
  create(token: CreateTokenDto): Promise<Token> {
    const exp = new Date(token.exp * 1000);
    const tokenSaved = this.tokenRepository.create({ jti: token.jti, exp });
    return this.tokenRepository.save(tokenSaved);
  }
  @Cron('0 */3 * * * *')
  async deleteExpiredToken() {
    await this.tokenRepository.delete({ exp: LessThan(new Date()) });
  }
}
