import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgetPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
  @IsString()
  @IsNotEmpty()
  readonly token: string;
  @IsString()
  @IsNotEmpty()
  readonly tokenId: string;
}
