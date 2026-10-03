import { PartialType } from '@nestjs/swagger';
import { CreateRolePermissionDto } from './create-role-permission.dto';

export class UpdateRolePermissionDTO extends PartialType(
  CreateRolePermissionDto,
) {}
