import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeUserPasswordDTO {
  @IsString()
  @IsNotEmpty()
  readonly currentPassword: string;
  @IsString()
  @IsNotEmpty()
  readonly newPassword: string;
}
