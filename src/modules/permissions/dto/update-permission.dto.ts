import { PartialType } from '@nestjs/swagger';
import { CreatePermissionDTO } from './create-permission.dto';

export class UpdatePermissionDTO extends PartialType(CreatePermissionDTO) {}
