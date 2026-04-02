import { PartialType } from '@nestjs/mapped-types';
import { CreateRolePermissionDto } from './create-role-permission.dto';

export class UpdateRolePermissionDTO extends PartialType(
  CreateRolePermissionDto,
) {}
