import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'douglas@gmail.com',
    description: 'E-mail do usuário',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    example: '123456',
    description: 'Senha de acesso',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
