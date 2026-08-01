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
@UseGuards(JwtGuard, PermissionGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Public()
  @Get()
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
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CategoryResponse> {
    const category: Category = await this.categoryService.findOne(id);
    return plainToInstance(CategoryResponse, category, {
      excludeExtraneousValues: true,
    });
  }

  @Post()
  @RequirePermissions('create:category')
  async createOne(@Body() body: CreateCategoryDTO): Promise<CategoryResponse> {
    const category = await this.categoryService.createOne(body);
    return plainToInstance(CategoryResponse, category, {
      excludeExtraneousValues: true,
    });
  }

  @RequirePermissions('update:category')
  @Patch(':id')
  async updateOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateCategoryDTO,
  ): Promise<CategoryResponse> {
    const category = await this.categoryService.updateOne(id, body);
    return plainToInstance(CategoryResponse, category, {
      excludeExtraneousValues: true,
    });
  }

  @RequirePermissions('delete:category')
  @Delete(':id')
  async deleteOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.categoryService.deleteOne(id);
  }
}
