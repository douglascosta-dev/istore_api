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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
import { Public } from 'src/common/decorators/public-permission.decorator';

@ApiTags('Images')
@UseGuards(JwtGuard, PermissionGuard)
@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Listar imagens com paginação (público)',
    description:
      'Retorna uma lista paginada de imagens cadastradas, com filtro opcional por tipo.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de imagens',
    type: [ImageResponse],
  })
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

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar imagem por ID (público)',
    description: 'Retorna a URL e os metadados de uma imagem específica.',
  })
  @ApiParam({ name: 'id', description: 'ID da imagem (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Imagem encontrada com sucesso',
    type: ImageResponse,
  })
  @ApiResponse({ status: 404, description: 'Imagem não encontrada' })
  async findOne(@Param('id') id: string): Promise<ImageResponse> {
    const image: Image = await this.imageService.findOne(id);
    return plainToInstance(ImageResponse, image, {
      excludeExtraneousValues: true,
    });
  }

  @ApiBearerAuth()
  @RequirePermissions('upload:image')
  @Post('upload/:type')
  @ApiOperation({
    summary: 'Upload de imagem única',
    description:
      'Faz o upload de um único arquivo de imagem para o tipo especificado (CATEGORY, PRODUCT ou TICKET).',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'type',
    enum: ImageType,
    description: 'Tipo da imagem enviada',
    example: ImageType.PRODUCT,
  })
  @ApiBody({
    description: 'Arquivo de imagem a ser enviado',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de imagem (JPEG, PNG, WEBP, etc.)',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Upload realizado com sucesso',
    type: ImageResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Formato de arquivo inválido ou tipo incorreto',
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (upload:image)' })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new HttpException(
              'Apenas imagens são permitidas',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }

        callback(null, true);
      },
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

  @ApiBearerAuth()
  @RequirePermissions('upload:image')
  @Post('upload-batch/:type')
  @ApiOperation({
    summary: 'Upload de múltiplas imagens em lote',
    description:
      'Faz o upload de até 10 imagens simultaneamente para o tipo informado.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'type',
    enum: ImageType,
    description: 'Tipo das imagens enviadas',
    example: ImageType.PRODUCT,
  })
  @ApiBody({
    description: 'Lista de arquivos de imagem (até 10 arquivos)',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Arquivos de imagem',
        },
      },
      required: ['files'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Upload em lote realizado com sucesso',
    type: [ImageResponse],
  })
  @ApiResponse({
    status: 400,
    description: 'Formato de arquivo inválido ou tipo incorreto',
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (upload:image)' })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new HttpException(
              'Apenas imagens são permitidas',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }

        callback(null, true);
      },
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

  @ApiBearerAuth()
  @RequirePermissions('delete:image')
  @Delete(':id')
  @ApiOperation({
    summary: 'Remover imagem',
    description: 'Exclui o registro e o arquivo da imagem do sistema.',
  })
  @ApiParam({ name: 'id', description: 'ID da imagem (UUID)' })
  @ApiResponse({ status: 200, description: 'Imagem removida com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (delete:image)' })
  @ApiResponse({ status: 404, description: 'Imagem não encontrada' })
  async deleteImage(@Param('id') id: string): Promise<void> {
    return await this.imageService.delete(id);
  }
}
