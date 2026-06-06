import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImageResponse } from './dto/image.response';
import { ImageService } from './images.service';
import { plainToInstance } from 'class-transformer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { ImageType } from './enum/image-type.enum';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { RequirePermissions } from 'src/common/decorators/role-permission.decorator';
import { Image } from './entities/image.entity';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { FindImageQueryDTO } from './dto/find-image-query.dto';
@UseGuards(JwtGuard, PermissionGuard)
@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @RequirePermissions('read:image')
  @Get()
  async findAll(
    @Query() query: FindImageQueryDTO,
  ): Promise<PaginatedResponse<ImageResponse>> {
    const images: PaginatedResponse<Image> =
      await this.imageService.findAll(query);
    return {
      ...images,
      data: plainToInstance(ImageResponse, images.data, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @RequirePermissions('read:image')
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ImageResponse> {
    const image: Image = await this.imageService.findOne(id);
    return plainToInstance(ImageResponse, image, {
      excludeExtraneousValues: true,
    });
  }

  @RequirePermissions('upload:image')
  @Post('upload/:type')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const type = req.params.type;
          callback(null, `./uploads/${type.toLowerCase()}`);
        },
        filename: (req, file, callback) => {
          const fileName = randomUUID() + extname(file.originalname);
          callback(null, fileName);
        },
      }),
    }),
  )
  async uploadImage(
    @Param('type') type: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImageResponse> {
    const imageType = ImageType[type as keyof typeof ImageType];
    if (!imageType)
      throw new HttpException(
        'Tipo de imagem inválido',
        HttpStatus.BAD_REQUEST,
      );
    const image = await this.imageService.upload(file, imageType);
    return plainToInstance(ImageResponse, image, {
      excludeExtraneousValues: true,
    });
  }

  @RequirePermissions('upload:image')
  @Post('upload-batch/:type')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const type = req.params.type;
          callback(null, `./uploads/${type.toLowerCase()}`);
        },
        filename: (req, file, callback) => {
          const fileName = randomUUID() + extname(file.originalname);
          callback(null, fileName);
        },
      }),
    }),
  )
  async uploadImageBach(
    @Param('type') type: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ImageResponse[]> {
    const imageType = ImageType[type as keyof typeof ImageType];
    if (!imageType)
      throw new HttpException(
        'Tipo de imagem inválido',
        HttpStatus.BAD_REQUEST,
      );
    const images: Image[] = await this.imageService.uploadBatch(
      files,
      imageType,
    );
    return plainToInstance(ImageResponse, images, {
      excludeExtraneousValues: true,
    });
  }
  @RequirePermissions('delete:image')
  @Delete(':id')
  async deleteImage(@Param('id') id: string): Promise<void> {
    return await this.imageService.delete(id);
  }
}
