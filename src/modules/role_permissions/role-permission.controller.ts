import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { RolePermissionResponse } from './dto/role-permission.response';
import { RolePermissionService } from './role-permission.service';
import { plainToInstance } from 'class-transformer';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';

@Controller('role-permissions')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}
  @Get()
  async findAll(): Promise<RolePermissionResponse[]> {
    const rolePermissions = await this.rolePermissionService.findAll();
    return plainToInstance(RolePermissionResponse, rolePermissions, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<RolePermissionResponse> {
    const rolePermission = await this.rolePermissionService.findOne(id);
    return plainToInstance(RolePermissionResponse, rolePermission, {
      excludeExtraneousValues: true,
    });
  }

  @Post()
  async createOne(
    @Body() body: CreateRolePermissionDto,
  ): Promise<RolePermissionResponse> {
    const rolePermission = await this.rolePermissionService.createOne(body);
    return plainToInstance(RolePermissionResponse, rolePermission, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  async updateOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: CreateRolePermissionDto,
  ): Promise<RolePermissionResponse> {
    const rolePermission = await this.rolePermissionService.updateOne(id, body);
    return plainToInstance(RolePermissionResponse, rolePermission, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  async deleteOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.rolePermissionService.deleteOne(id);
  }
}
