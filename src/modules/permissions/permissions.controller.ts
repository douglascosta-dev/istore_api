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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionResponse } from './dto/permission.response';
import { PermissionService } from './permissions.service';
import { plainToInstance } from 'class-transformer';
import { CreatePermissionDTO } from './dto/create-permission.dto';
import { UpdatePermissionDTO } from './dto/update-permission.dto';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { RequirePermissions } from 'src/common/decorators/role-permission.decorator';
import { JwtGuard } from 'src/common/guards/jwt.guard';

@ApiTags('Permissions')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @RequirePermissions('read:permission')
  @Get()
  @ApiOperation({
    summary: 'Listar todas as permissões',
    description:
      'Retorna a lista completa de permissões disponíveis no sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de permissões retornada com sucesso',
    type: [PermissionResponse],
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (read:permission)' })
  async findall(): Promise<PermissionResponse[]> {
    const permissions = await this.permissionService.findAll();
    return plainToInstance(PermissionResponse, permissions, {
      excludeExtraneousValues: true,
    });
  }

  @RequirePermissions('read:permission')
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar permissão por ID',
    description: 'Retorna os detalhes de uma permissão específica.',
  })
  @ApiParam({ name: 'id', description: 'ID da permissão (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Permissão encontrada com sucesso',
    type: PermissionResponse,
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (read:permission)' })
  @ApiResponse({ status: 404, description: 'Permissão não encontrada' })
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
  @ApiOperation({
    summary: 'Criar nova permissão',
    description: 'Cadastra uma nova permissão no sistema.',
  })
  @ApiResponse({
    status: 201,
    description: 'Permissão criada com sucesso',
    type: PermissionResponse,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão (create:permission)',
  })
  async createOne(
    @Body() body: CreatePermissionDTO,
  ): Promise<PermissionResponse> {
    const permission = await this.permissionService.createOne(body);
    return plainToInstance(PermissionResponse, permission, {
      excludeExtraneousValues: true,
    });
  }

  @RequirePermissions('update:permission')
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar permissão',
    description: 'Atualiza o nome de uma permissão existente.',
  })
  @ApiParam({ name: 'id', description: 'ID da permissão (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Permissão atualizada com sucesso',
    type: PermissionResponse,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão (update:permission)',
  })
  @ApiResponse({ status: 404, description: 'Permissão não encontrada' })
  async updateOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdatePermissionDTO,
  ): Promise<PermissionResponse> {
    const permission = await this.permissionService.updateOne(id, body);
    return plainToInstance(PermissionResponse, permission, {
      excludeExtraneousValues: true,
    });
  }

  @RequirePermissions('delete:permission')
  @Delete(':id')
  @ApiOperation({
    summary: 'Remover permissão',
    description: 'Exclui uma permissão do sistema por ID.',
  })
  @ApiParam({ name: 'id', description: 'ID da permissão (UUID)' })
  @ApiResponse({ status: 200, description: 'Permissão removida com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão (delete:permission)',
  })
  @ApiResponse({ status: 404, description: 'Permissão não encontrada' })
  async deleteOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.permissionService.deleteOne(id);
  }
}
