import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateRolePermission {
  @ApiProperty({
    example: 'ADMIN',
    description: 'Nome da role a ser validada',
  })
  @IsString()
  @IsNotEmpty()
  roleName: string;

  @ApiProperty({
    example: 'read:user',
    description: 'Nome da permissão a ser validada',
  })
  @IsString()
  @IsNotEmpty()
  permissionName: string;
}
