import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PermissionResponse } from './dto/permission.response';
import { PermissionService } from './permissions.service';
import { plainToInstance } from 'class-transformer';
import { CreatePermissionDTO } from './dto/create-permission.dto';
import { UpdatePermissionDTO } from './dto/update-permission.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { RequirePermissions } from 'src/common/decorators/role-permission.decorator';
@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}
  @RequirePermissions('read:permission')
  @Get()
  async findall(): Promise<PermissionResponse[]> {
    const permissions = await this.permissionService.findAll();
    return plainToInstance(PermissionResponse, permissions, {
      excludeExtraneousValues: true,
    });
  }
  @RequirePermissions('read:permission')
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<PermissionResponse> {
    const permission = await this.permissionService.findOne(id);
    return plainToInstance(PermissionResponse, permission, {
      excludeExtraneousValues: true,
    });
  }
  @RequirePermissions('create:permission')
  @Post()
  async createOne(
    @Body() body: CreatePermissionDTO,
  ): Promise<PermissionResponse> {
    const permission = await this.permissionService.createOne(body);
    return plainToInstance(PermissionResponse, permission, {
      excludeExtraneousValues: true,
    });
  }
  @RequirePermissions(
    'read:permission',
    'update:permission',
    'create:permission',
  )
  @Patch(':id')
  async updateOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdatePermissionDTO,
  ): Promise<PermissionResponse> {
    const permission = await this.permissionService.updateOne(id, body);
    return plainToInstance(PermissionResponse, permission, {
      excludeExtraneousValues: true,
    });
  }
  @RequirePermissions(
    'read:permission',
    'update:permission',
    'create:permission',
  )
  @Delete(':id')
  async deleteOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.permissionService.deleteOne(id);
  }
}
