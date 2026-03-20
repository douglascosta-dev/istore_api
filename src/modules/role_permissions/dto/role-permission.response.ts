import { Expose, Type } from 'class-transformer';
import { PermissionResponse } from 'src/modules/permissions/dto/permission.response';
import { RoleResponse } from 'src/modules/roles/dto/role.response';

export class RolePermissionResponse {
  @Expose()
  id: string;
  @Expose()
  @Type(() => RoleResponse)
  role: RoleResponse;
  @Expose()
  @Type(() => PermissionResponse)
  permission: PermissionResponse;
}
