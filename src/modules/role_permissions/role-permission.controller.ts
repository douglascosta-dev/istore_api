import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RolePermissionResponse } from './dto/role-permission.response';
import { RolePermissionService } from './role-permission.service';
import { plainToInstance } from 'class-transformer';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { FindRolePermissionQueryDTO } from './dto/find-role-permission-query.dto';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';

@Controller('role-permissions')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}
  @Get()
  async findAll(
    @Query() query: FindRolePermissionQueryDTO,
  ): Promise<PaginatedResponse<RolePermissionResponse>> {
    const rolePermissions = await this.rolePermissionService.findAll(query);
    return {
      ...rolePermissions,
      data: plainToInstance(RolePermissionResponse, rolePermissions.data, {
        excludeExtraneousValues: true,
      }),
    };
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
