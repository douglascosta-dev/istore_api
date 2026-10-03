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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateRoleDTO } from './dto/update-role.dto';
import { CreateRoleDTO } from './dto/create-role.dto';
import { FindRolesQueryDTO } from './dto/find-role-query.dto';
import { RoleResponse } from './dto/role.response';
import { RoleService } from './roles.service';
import { plainToInstance } from 'class-transformer';
import { UserResponse } from '../users/dto/user.response';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { RequirePermissions } from 'src/common/decorators/role-permission.decorator';
import { JwtGuard } from 'src/common/guards/jwt.guard';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @RequirePermissions('read:role')
  @Get()
  @ApiOperation({
    summary: 'Listar roles com paginação',
    description: 'Retorna uma lista paginada de perfis de usuário (roles).',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de roles retornada com sucesso',
    type: [RoleResponse],
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (read:role)' })
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

  @RequirePermissions('read:role')
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar role por ID',
    description: 'Retorna os dados de uma role específica.',
  })
  @ApiParam({ name: 'id', description: 'ID da role (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Role encontrada com sucesso',
    type: RoleResponse,
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (read:role)' })
  @ApiResponse({ status: 404, description: 'Role não encontrada' })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<RoleResponse> {
    const role = await this.roleService.findOne(id);
    return plainToInstance(RoleResponse, role, {
      excludeExtraneousValues: true,
    });
  }

  @RequirePermissions('read:role', 'read:user')
  @Get(':id/users')
  @ApiOperation({
    summary: 'Buscar usuários associados à role',
    description:
      'Retorna a lista paginada de usuários que possuem a role especificada.',
  })
  @ApiParam({ name: 'id', description: 'ID da role (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
    type: [UserResponse],
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão (read:role, read:user)',
  })
  @ApiResponse({ status: 404, description: 'Role não encontrada' })
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

  @RequirePermissions('create:role')
  @Post()
  @ApiOperation({
    summary: 'Criar nova role',
    description: 'Cadastra um novo perfil de usuário no sistema.',
  })
  @ApiResponse({
    status: 201,
    description: 'Role criada com sucesso',
    type: RoleResponse,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (create:role)' })
  async createRole(@Body() body: CreateRoleDTO): Promise<RoleResponse> {
    const role = await this.roleService.createOne(body);
    return plainToInstance(RoleResponse, role, {
      excludeExtraneousValues: true,
    });
  }

  @RequirePermissions('update:role')
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar role',
    description: 'Atualiza o nome de um perfil de usuário existente.',
  })
  @ApiParam({ name: 'id', description: 'ID da role (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Role atualizada com sucesso',
    type: RoleResponse,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (update:role)' })
  @ApiResponse({ status: 404, description: 'Role não encontrada' })
  async updateRole(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateRoleDTO,
  ): Promise<RoleResponse> {
    const role = await this.roleService.updateOne(id, body);
    return plainToInstance(RoleResponse, role, {
      excludeExtraneousValues: true,
    });
  }

  @RequirePermissions('delete:role')
  @Delete(':id')
  @ApiOperation({
    summary: 'Remover role',
    description: 'Exclui um perfil de usuário do sistema.',
  })
  @ApiParam({ name: 'id', description: 'ID da role (UUID)' })
  @ApiResponse({ status: 200, description: 'Role removida com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (delete:role)' })
  @ApiResponse({ status: 404, description: 'Role não encontrada' })
  async removeRole(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.roleService.deleteOne(id);
  }
}
