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
import { CategoryResponse } from './dto/category.response';
import { CategoryService } from './categories.service';
import { Category } from './entities/category.entity';
import { FindCategoryQueryDTO } from './dto/find-category-query.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateCategoryDTO } from './dto/update-category.dto';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Public } from 'src/common/decorators/public-permission.decorator';
import { RequirePermissions } from 'src/common/decorators/role-permission.decorator';

@ApiTags('Categories')
@UseGuards(JwtGuard, PermissionGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Listar categorias com paginação (público)',
    description:
      'Retorna a lista de categorias cadastradas para navegação na loja.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de categorias',
    type: [CategoryResponse],
  })
  async findAll(
    @Query() query: FindCategoryQueryDTO,
  ): Promise<PaginatedResponse<CategoryResponse>> {
    const categories: PaginatedResponse<Category> =
      await this.categoryService.findAll(query);
    return {
      ...categories,
      data: plainToInstance(CategoryResponse, categories.data, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar categoria por ID (público)',
    description: 'Retorna os detalhes de uma categoria específica.',
  })
  @ApiParam({ name: 'id', description: 'ID da categoria (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Categoria encontrada com sucesso',
    type: CategoryResponse,
  })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CategoryResponse> {
    const category: Category = await this.categoryService.findOne(id);
    return plainToInstance(CategoryResponse, category, {
      excludeExtraneousValues: true,
    });
  }

  @ApiBearerAuth()
  @RequirePermissions('create:category')
  @Post()
  @ApiOperation({
    summary: 'Criar categoria',
    description: 'Cadastra uma nova categoria no sistema.',
  })
  @ApiResponse({
    status: 201,
    description: 'Categoria criada com sucesso',
    type: CategoryResponse,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (create:category)' })
  async createOne(@Body() body: CreateCategoryDTO): Promise<CategoryResponse> {
    const category = await this.categoryService.createOne(body);
    return plainToInstance(CategoryResponse, category, {
      excludeExtraneousValues: true,
    });
  }

  @ApiBearerAuth()
  @RequirePermissions('update:category')
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar categoria',
    description: 'Atualiza dados de uma categoria existente.',
  })
  @ApiParam({ name: 'id', description: 'ID da categoria (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Categoria atualizada com sucesso',
    type: CategoryResponse,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (update:category)' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async updateOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateCategoryDTO,
  ): Promise<CategoryResponse> {
    const category = await this.categoryService.updateOne(id, body);
    return plainToInstance(CategoryResponse, category, {
      excludeExtraneousValues: true,
    });
  }

  @ApiBearerAuth()
  @RequirePermissions('delete:category')
  @Delete(':id')
  @ApiOperation({
    summary: 'Remover categoria',
    description: 'Exclui uma categoria por ID.',
  })
  @ApiParam({ name: 'id', description: 'ID da categoria (UUID)' })
  @ApiResponse({ status: 200, description: 'Categoria removida com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (delete:category)' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async deleteOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.categoryService.deleteOne(id);
  }
}
