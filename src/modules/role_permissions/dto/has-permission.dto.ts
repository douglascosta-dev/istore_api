import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateRolePermission {
  @IsString()
  @IsNotEmpty()
  roleName: string;
  @IsString()
  @IsNotEmpty()
  permissionName: string;
}
