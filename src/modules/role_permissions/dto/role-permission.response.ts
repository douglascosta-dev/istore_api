import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PermissionResponse } from 'src/modules/permissions/dto/permission.response';
import { RoleResponse } from 'src/modules/roles/dto/role.response';

export class RolePermissionResponse {
  @ApiProperty({
    example: 'e1f2a3b4-5678-90ab-cdef-1234567890ab',
    description: 'ID da vinculação (UUID)',
  })
  @Expose()
  id: string;

  @ApiProperty({
    type: () => RoleResponse,
    description: 'Role associada',
  })
  @Expose()
  @Type(() => RoleResponse)
  role: RoleResponse;

  @ApiProperty({
    type: () => PermissionResponse,
    description: 'Permissão associada',
  })
  @Expose()
  @Type(() => PermissionResponse)
  permission: PermissionResponse;
}
