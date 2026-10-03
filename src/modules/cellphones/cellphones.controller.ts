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
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { CellphoneResponse } from './dto/cellphone.response';
import { FindCellphoneQueryDTO } from './dto/find-cellphone-query.dto';
import { CellphoneService } from './cellphones.service';
import { plainToInstance } from 'class-transformer';
import { CreateCellphoneDTO } from './dto/create-cellphone.dto';
import { UpdateCellphoneDTO } from './dto/update-cellphone.dto';
import { CellphoneUserResponse } from './dto/cellphone-users.response';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { RequirePermissions } from 'src/common/decorators/role-permission.decorator';
import { JwtGuard } from 'src/common/guards/jwt.guard';

@ApiTags('Cellphones')
@ApiBearerAuth()
@Controller('cellphones')
@UseGuards(JwtGuard, PermissionGuard)
export class CellphoneController {
  constructor(private readonly cellphoneService: CellphoneService) {}

  @RequirePermissions('read:cellphone')
  @Get()
  @ApiOperation({
    summary: 'Listar telefones com paginação',
    description: 'Retorna a lista paginada de telefones cadastrados.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de telefones',
    type: [CellphoneResponse],
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (read:cellphone)' })
  async findAll(
    @Query() query: FindCellphoneQueryDTO,
  ): Promise<PaginatedResponse<CellphoneResponse>> {
    const cellphones = await this.cellphoneService.findAll(query);
    return {
      ...cellphones,
      data: plainToInstance(CellphoneResponse, cellphones.data, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @RequirePermissions('read:cellphone', 'read:user')
  @Get('/users')
  @ApiOperation({
    summary: 'Listar telefones com dados dos usuários',
    description:
      'Retorna a lista paginada de telefones com detalhes dos usuários proprietários.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de telefones com usuários vinculados',
    type: [CellphoneUserResponse],
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão (read:cellphone, read:user)',
  })
  async findOneWithUsers(
    @Query() query: FindCellphoneQueryDTO,
  ): Promise<PaginatedResponse<CellphoneUserResponse>> {
    return await this.cellphoneService.findAllWithUsers(query);
  }

  @RequirePermissions('read:cellphone')
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar telefone por ID',
    description: 'Retorna os detalhes de um telefone específico.',
  })
  @ApiParam({ name: 'id', description: 'ID do telefone (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Telefone encontrado com sucesso',
    type: CellphoneUserResponse,
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (read:cellphone)' })
  @ApiResponse({ status: 404, description: 'Telefone não encontrado' })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CellphoneUserResponse> {
    const cellphone = await this.cellphoneService.findOne(id);
    return plainToInstance(CellphoneUserResponse, cellphone, {
      excludeExtraneousValues: true,
    });
  }

  @RequirePermissions('create:cellphone')
  @Post()
  @ApiOperation({
    summary: 'Cadastrar novo telefone',
    description: 'Vincula um novo número de telefone a um usuário.',
  })
  @ApiResponse({
    status: 201,
    description: 'Telefone cadastrado com sucesso',
    type: CellphoneResponse,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (create:cellphone)' })
  async createdOne(
    @Body() body: CreateCellphoneDTO,
  ): Promise<CellphoneResponse> {
    const cellphone = await this.cellphoneService.createOne(body);
    return plainToInstance(CellphoneResponse, cellphone, {
      excludeExtraneousValues: true,
    });
  }

  @RequirePermissions('update:cellphone')
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar telefone',
    description: 'Atualiza o número de um telefone existente.',
  })
  @ApiParam({ name: 'id', description: 'ID do telefone (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Telefone atualizado com sucesso',
    type: CellphoneResponse,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (update:cellphone)' })
  @ApiResponse({ status: 404, description: 'Telefone não encontrado' })
  async updateOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateCellphoneDTO,
  ): Promise<CellphoneResponse> {
    const cellphone = await this.cellphoneService.updateOne(id, body);
    return plainToInstance(CellphoneResponse, cellphone, {
      excludeExtraneousValues: true,
    });
  }

  @RequirePermissions('delete:cellphone')
  @Delete(':id')
  @ApiOperation({
    summary: 'Remover telefone',
    description: 'Exclui um telefone cadastrado por ID.',
  })
  @ApiParam({ name: 'id', description: 'ID do telefone (UUID)' })
  @ApiResponse({ status: 200, description: 'Telefone removido com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (delete:cellphone)' })
  @ApiResponse({ status: 404, description: 'Telefone não encontrado' })
  async deleteOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.cellphoneService.deleteOne(id);
  }
}
