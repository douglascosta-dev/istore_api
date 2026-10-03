import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestForgetPasswordDTO {
  @ApiProperty({
    example: 'douglas@gmail.com',
    description: 'E-mail cadastrado para receber instruções de recuperação',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
