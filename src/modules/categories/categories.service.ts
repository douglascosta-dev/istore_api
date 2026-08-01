import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../images/entities/image.entity';
import { Category } from './entities/category.entity';
import { FindCategoryQueryDTO } from './dto/find-category-query.dto';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { buildPaginatedResponse } from 'src/common/helpers/pagination.helper';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { ImageType } from '../images/enum/image-type.enum';
import { UpdateCategoryDTO } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}
  async findAll(
    query: FindCategoryQueryDTO,
  ): Promise<PaginatedResponse<Category>> {
    const {
      page = 1 as number,
      limit = 30 as number,
      name = '' as string,
    } = query;

    const safeLimit = Math.min(limit, 100);
    const skip = (page - 1) * safeLimit;
    const qb = this.categoryRepository.createQueryBuilder('category');

    qb.leftJoinAndSelect('category.image', 'image');

    if (name) {
      qb.andWhere('category.name ILIKE :name', {
        name: `%${name}%`,
      });
    }

    qb.skip(skip).take(safeLimit);

    const [data, total] = await qb.getManyAndCount();
    const categories = buildPaginatedResponse(data, total, page, safeLimit);

    if (!categories)
      throw new HttpException(
        'Nenhuma categoria encontrada',
        HttpStatus.NOT_FOUND,
      );

    return categories;
  }

  async findOne(id: string): Promise<Category> {
    const category: Category | null = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });

    if (!category)
      throw new HttpException(
        'Nenhuma categoria encontrada',
        HttpStatus.NOT_FOUND,
      );

    return category;
  }

  async createOne(body: CreateCategoryDTO): Promise<Category> {
    let image: Image | null = null;

    if (body?.imageId) {
      image = await this.imageRepository.findOne({
        where: {
          id: body.imageId,
        },
      });

      if (!image)
        throw new HttpException(
          'Nenhuma imagem encontrada',
          HttpStatus.NOT_FOUND,
        );

      if (image.type !== ImageType.CATEGORY)
        throw new HttpException(
          'Tipo de imagem inválido. Para vincular uma imagem a uma categoria, selecione uma imagem do tipo CATEGORY',
          HttpStatus.BAD_REQUEST,
        );
    }

    const category: Category = this.categoryRepository.create({
      ...body,
      image: image ?? undefined,
    });

    return await this.categoryRepository.save(category);
  }

  async updateOne(id: string, body: UpdateCategoryDTO): Promise<Category> {
    let image: Image | null = null;

    if (body?.imageId) {
      image = await this.imageRepository.findOne({
        where: { id: body.imageId },
      });

      if (!image)
        throw new HttpException(
          'Nenhuma imagem encontrada',
          HttpStatus.NOT_FOUND,
        );

      if (image.type !== ImageType.CATEGORY)
        throw new HttpException(
          'Tipo de imagem inválido. Para vincular uma imagem a uma categoria, selecione uma imagem do tipo CATEGORY',
          HttpStatus.BAD_REQUEST,
        );
    }

    const category = await this.categoryRepository.preload({
      id: id,
      ...body,
      image: image ?? undefined,
    });

    if (!category)
      throw new HttpException(
        'Nenhuma categoria encontrada',
        HttpStatus.NOT_FOUND,
      );

    return await this.categoryRepository.save(category);
  }

  async deleteOne(id: string): Promise<void> {
    await this.categoryRepository.softDelete(id);
  }
}
