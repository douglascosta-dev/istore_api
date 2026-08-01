import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Image } from './entities/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ImageType } from './enum/image-type.enum';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { FindImageQueryDTO } from './dto/find-image-query.dto';
import { buildPaginatedResponse } from 'src/common/helpers/pagination.helper';
@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async findAll(query: FindImageQueryDTO): Promise<PaginatedResponse<Image>> {
    const { page = 1 as number, limit = 30 as number, type } = query;
    const safeLimit: number = Math.min(limit, 100);
    const skip: number = (page - 1) * safeLimit;
    const qb: SelectQueryBuilder<Image> =
      this.imageRepository.createQueryBuilder('image');

    if (type) {
      qb.andWhere('image.type = type', {
        type,
      });
    }
    qb.skip(skip).take(safeLimit);
    const [data, total] = await qb.getManyAndCount();
    const images: PaginatedResponse<Image> = buildPaginatedResponse(
      data,
      total,
      page,
      safeLimit,
    );
    if (!images)
      throw new HttpException(
        'Nenhuma imagem encontrada',
        HttpStatus.NOT_FOUND,
      );
    return images;
  }

  async findOne(id: string): Promise<Image> {
    const image: Image | null = await this.imageRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!image)
      throw new HttpException(
        'Nenhuma imagem encontrada',
        HttpStatus.NOT_FOUND,
      );
    return image;
  }

  async upload(file: Express.Multer.File, type: ImageType): Promise<Image> {
    const image: Image = this.imageRepository.create({
      type: type,
      mimeType: file.mimetype,
      originalName: file.originalname,
      serverName: file.filename,
      path: file.path,
      size: file.size,
    });
    return await this.imageRepository.save(image);
  }

  async uploadBatch(
    files: Express.Multer.File[],
    type: ImageType,
  ): Promise<Image[]> {
    if (!files?.length)
      throw new HttpException('Nenhuma imagem enviada', HttpStatus.BAD_REQUEST);
    const images: Image[] = files.map((file) => {
      return this.imageRepository.create({
        type: type,
        mimeType: file.mimetype,
        originalName: file.originalname,
        serverName: file.filename,
        path: file.path,
        size: file.size,
      });
    });
    return await this.imageRepository.save(images);
  }

  async delete(id: string): Promise<void> {
    const image: Image | null = await this.imageRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!image)
      throw new HttpException(
        'Nenhuma imagem encontrada',
        HttpStatus.NOT_FOUND,
      );
    await this.imageRepository.remove(image);
  }
}
