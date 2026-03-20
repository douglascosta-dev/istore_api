import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRolePermissionDto {
  @IsUUID()
  @IsNotEmpty()
  roleId: string;
  @IsUUID()
  @IsNotEmpty()
  permissionId: string;
}
