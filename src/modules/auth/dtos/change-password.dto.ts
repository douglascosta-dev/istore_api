import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeUserPasswordDTO {
  @ApiProperty({
    example: '123456',
    description: 'Senha atual do usuário',
  })
  @IsString()
  @IsNotEmpty()
  readonly currentPassword: string;

  @ApiProperty({
    example: '654321',
    description: 'Nova senha desejada',
  })
  @IsString()
  @IsNotEmpty()
  readonly newPassword: string;
}
