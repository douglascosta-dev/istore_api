import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordResetDTO {
  @IsString()
  @IsNotEmpty()
  readonly token: string;
  @IsString()
  @IsNotEmpty()
  readonly tokenId: string;
  @IsString()
  @IsNotEmpty()
  readonly newPassword: string;
}
