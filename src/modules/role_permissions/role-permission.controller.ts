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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolePermissionResponse } from './dto/role-permission.response';
import { RolePermissionService } from './role-permission.service';
import { plainToInstance } from 'class-transformer';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { FindRolePermissionQueryDTO } from './dto/find-role-permission-query.dto';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { UpdateRolePermissionDTO } from './dto/update-role-permission.dto';

@ApiTags('Role Permissions')
@Controller('role-permissions')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar permissões vinculadas às roles com paginação',
    description:
      'Retorna a lista paginada de associações entre roles e permissões.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de permissões vinculadas',
    type: [RolePermissionResponse],
  })
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
  @ApiOperation({
    summary: 'Buscar associação role-permissão por ID',
    description: 'Retorna os detalhes de um vínculo específico.',
  })
  @ApiParam({ name: 'id', description: 'ID da vinculação (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Vinculação encontrada com sucesso',
    type: RolePermissionResponse,
  })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<RolePermissionResponse> {
    const rolePermission = await this.rolePermissionService.findOne(id);
    return plainToInstance(RolePermissionResponse, rolePermission, {
      excludeExtraneousValues: true,
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Vincular permissão a uma role',
    description: 'Cria uma nova associação entre uma role e uma permissão.',
  })
  @ApiResponse({
    status: 201,
    description: 'Vínculo criado com sucesso',
    type: RolePermissionResponse,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({
    status: 409,
    description: 'Permissão já vinculada a esta role',
  })
  async createOne(
    @Body() body: CreateRolePermissionDto,
  ): Promise<RolePermissionResponse> {
    const rolePermission = await this.rolePermissionService.createOne(body);
    return plainToInstance(RolePermissionResponse, rolePermission, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar vínculo role-permissão',
    description: 'Atualiza os dados de uma associação existente.',
  })
  @ApiParam({ name: 'id', description: 'ID da vinculação (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Vínculo atualizado com sucesso',
    type: RolePermissionResponse,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  async updateOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateRolePermissionDTO,
  ): Promise<RolePermissionResponse> {
    const rolePermission = await this.rolePermissionService.updateOne(id, body);
    return plainToInstance(RolePermissionResponse, rolePermission, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover vínculo role-permissão',
    description: 'Exclui a associação entre a role e a permissão informada.',
  })
  @ApiParam({ name: 'id', description: 'ID da vinculação (UUID)' })
  @ApiResponse({ status: 200, description: 'Vínculo removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  async deleteOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.rolePermissionService.deleteOne(id);
  }
}
