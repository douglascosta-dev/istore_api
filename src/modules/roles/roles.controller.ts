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
import { UpdateRoleDTO } from './dto/update-role.dto';
import { CreateRoleDTO } from './dto/create-role.dto';
import { FindRolesQueryDTO } from './dto/find-role-query.dto';
import { RoleResponse } from './dto/role.response';
import { RoleService } from './roles.service';
import { plainToInstance } from 'class-transformer';
import { UserResponse } from '../users/dto/user.response';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Get()
  async findAll(
    @Query() query: FindRolesQueryDTO,
  ): Promise<PaginatedResponse<RoleResponse>> {
    const roles = await this.roleService.findAll(query);
    return {
      ...roles,
      data: plainToInstance(RoleResponse, roles.data, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<RoleResponse> {
    const role = await this.roleService.findOne(id);
    return plainToInstance(RoleResponse, role, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id/users')
  async findOneWithUsers(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() query: FindRolesQueryDTO,
  ): Promise<PaginatedResponse<UserResponse>> {
    const result = await this.roleService.findOneWithUsers(id, query);
    return {
      ...result,
      data: plainToInstance(UserResponse, result.data, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @Post()
  async createRole(@Body() body: CreateRoleDTO) {
    const role = await this.roleService.createOne(body);
    return plainToInstance(RoleResponse, role, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  async updateRole(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateRoleDTO,
  ) {
    const role = await this.roleService.updateOne(id, body);
    return plainToInstance(RoleResponse, role, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  async removeRole(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.roleService.deleteOne(id);
  }
}
