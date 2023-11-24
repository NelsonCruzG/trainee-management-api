import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'The user first name' })
  @Length(2, 50)
  readonly firstName: string;

  @ApiProperty({ description: 'The user last name' })
  @Length(2, 50)
  readonly lastName: string;

  @ApiProperty({ description: 'The user phone number' })
  @Length(10, 20)
  @Matches(/[\d]{3,4}\s[\d]{8,20}/, {
    message: `phone number must have a valid format E.g. [ 503 12345678 ]`,
  })
  readonly phone: string;

  @ApiProperty({ description: 'The user email, required for loggin' })
  @IsEmail()
  readonly email: string;
}
