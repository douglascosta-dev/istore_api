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
import { AddressService } from './address.service';
import { AddressResponse } from './dto/address.response';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { FindAddressQueryDTO } from './dto/find-address-query.dto';
import { plainToInstance } from 'class-transformer';
import { CreateAddressDTO } from './dto/create-adress.dto';
import { UpdateAdressDTO } from './dto/update-adress.dto';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { RequirePermissions } from 'src/common/decorators/role-permission.decorator';
import { JwtGuard } from 'src/common/guards/jwt.guard';

@ApiTags('Addresses')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @RequirePermissions('read:address')
  @Get()
  @ApiOperation({
    summary: 'Listar endereços com paginação',
    description:
      'Retorna uma lista paginada de endereços cadastrados conforme os filtros informados.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de endereços',
    type: [AddressResponse],
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (read:address)' })
  async findAll(
    @Query() query: FindAddressQueryDTO,
  ): Promise<PaginatedResponse<AddressResponse>> {
    const address = await this.addressService.findAll(query);
    return {
      ...address,
      data: plainToInstance(AddressResponse, address.data, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @RequirePermissions('read:address')
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar endereço por ID',
    description: 'Retorna as informações completas de um endereço específico.',
  })
  @ApiParam({ name: 'id', description: 'ID do endereço (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Endereço encontrado com sucesso',
    type: AddressResponse,
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (read:address)' })
  @ApiResponse({ status: 404, description: 'Endereço não encontrado' })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<AddressResponse> {
    const address = await this.addressService.findOne(id);
    return plainToInstance(AddressResponse, address, {
      excludeExtraneousValues: true,
    });
  }

  @RequirePermissions('create:address')
  @Post()
  @ApiOperation({
    summary: 'Cadastrar novo endereço',
    description: 'Adiciona um novo endereço associado a um usuário.',
  })
  @ApiResponse({
    status: 201,
    description: 'Endereço cadastrado com sucesso',
    type: AddressResponse,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (create:address)' })
  async createOne(@Body() body: CreateAddressDTO): Promise<AddressResponse> {
    const address = await this.addressService.createOne(body);
    return plainToInstance(AddressResponse, address, {
      excludeExtraneousValues: true,
    });
  }

  @RequirePermissions('update:address')
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar endereço',
    description: 'Atualiza os dados de um endereço existente.',
  })
  @ApiParam({ name: 'id', description: 'ID do endereço (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Endereço atualizado com sucesso',
    type: AddressResponse,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (update:address)' })
  @ApiResponse({ status: 404, description: 'Endereço não encontrado' })
  async updateOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateAdressDTO,
  ): Promise<AddressResponse> {
    const address = await this.addressService.updateOne(id, body);
    return plainToInstance(AddressResponse, address, {
      excludeExtraneousValues: true,
    });
  }

  @RequirePermissions('delete:address')
  @Delete(':id')
  @ApiOperation({
    summary: 'Remover endereço',
    description: 'Exclui um endereço por ID.',
  })
  @ApiParam({ name: 'id', description: 'ID do endereço (UUID)' })
  @ApiResponse({ status: 200, description: 'Endereço removido com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (delete:address)' })
  @ApiResponse({ status: 404, description: 'Endereço não encontrado' })
  async deleteOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.addressService.deleteOne(id);
  }
}
