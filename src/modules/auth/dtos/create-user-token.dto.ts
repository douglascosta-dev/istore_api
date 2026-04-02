import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserToken {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
  @IsString()
  @IsNotEmpty()
  readonly role: string;
}
