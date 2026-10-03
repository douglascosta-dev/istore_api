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
import { UserResponse } from './dto/user.response';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { UserService } from './users.service';
import { plainToInstance } from 'class-transformer';
import { FindUserQueryDTO } from './dto/find-user-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { CreateClientUserDTO } from './create-client-user.dto';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { RequirePermissions } from 'src/common/decorators/role-permission.decorator';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { Public } from 'src/common/decorators/public-permission.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @RequirePermissions('read:user')
  @Get()
  @ApiOperation({
    summary: 'Listar usuários com paginação',
    description:
      'Retorna a lista paginada de usuários de acordo com os filtros informados.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de usuários',
    type: [UserResponse],
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (read:user)' })
  async findAll(
    @Query() query: FindUserQueryDTO,
  ): Promise<PaginatedResponse<UserResponse>> {
    const users = await this.userService.findAll(query);
    return {
      ...users,
      data: plainToInstance(UserResponse, users.data, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @RequirePermissions('read:user')
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description: 'Retorna os detalhes completos de um usuário.',
  })
  @ApiParam({ name: 'id', description: 'ID do usuário (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso',
    type: UserResponse,
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (read:user)' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserResponse> {
    const user = await this.userService.findOne(id);
    return plainToInstance(UserResponse, user, {
      excludeExtraneousValues: true,
    });
  }

  @RequirePermissions('create:user')
  @Post()
  @ApiOperation({
    summary: 'Cadastrar usuário administrativo',
    description: 'Cria um usuário interno associado a uma role específica.',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: UserResponse,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos na requisição' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (create:user)' })
  async createOne(@Body() body: CreateUserDto): Promise<UserResponse> {
    const user = await this.userService.createOne(body);
    return plainToInstance(UserResponse, user, {
      excludeExtraneousValues: true,
    });
  }

  @Public()
  @Post('client')
  @ApiOperation({
    summary: 'Cadastrar novo cliente (público)',
    description:
      'Cria uma nova conta de cliente na loja. Não requer autenticação.',
  })
  @ApiResponse({
    status: 201,
    description: 'Cliente cadastrado com sucesso',
    type: UserResponse,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos na requisição' })
  async createClient(@Body() body: CreateClientUserDTO): Promise<UserResponse> {
    const user = await this.userService.createClient(body);
    return plainToInstance(UserResponse, user, {
      excludeExtraneousValues: true,
    });
  }

  @RequirePermissions('update:user')
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar usuário',
    description:
      'Atualiza parcialmente as informações de um usuário existente.',
  })
  @ApiParam({ name: 'id', description: 'ID do usuário (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    type: UserResponse,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos na requisição' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (update:user)' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async updateOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateUserDTO,
  ): Promise<UserResponse> {
    const user = await this.userService.updateOne(id, body);
    return plainToInstance(UserResponse, user, {
      excludeExtraneousValues: true,
    });
  }

  @RequirePermissions('delete:user')
  @Delete(':id')
  @ApiOperation({
    summary: 'Remover usuário',
    description:
      'Remove logicamente ou fisicamente o usuário informado por ID.',
  })
  @ApiParam({ name: 'id', description: 'ID do usuário (UUID)' })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (delete:user)' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async deleteOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.userService.deleteOne(id);
  }
}
