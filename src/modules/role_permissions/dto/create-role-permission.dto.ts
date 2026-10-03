import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRolePermissionDto {
  @ApiProperty({
    example: 'c2b425b0-9b43-4610-8ec4-ff7036d390a8',
    description: 'ID da role (UUID)',
  })
  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID da permissão (UUID)',
  })
  @IsUUID()
  @IsNotEmpty()
  permissionId: string;
}
