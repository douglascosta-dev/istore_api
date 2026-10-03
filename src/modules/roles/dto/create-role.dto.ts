import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDTO {
  @ApiProperty({
    example: 'ADMIN',
    description: 'Nome do perfil de acesso (Role)',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
