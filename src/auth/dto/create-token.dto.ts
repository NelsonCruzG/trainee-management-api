import { IsDateString, IsString } from 'class-validator';

export class CreateTokenDto {
  @IsString()
  jti: string;

  @IsDateString()
  exp: number;
}
