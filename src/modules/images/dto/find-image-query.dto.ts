import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDTO } from 'src/common/dto/pagination.dto';
import { ImageType } from '../enum/image-type.enum';

export class FindImageQueryDTO extends PaginationQueryDTO {
  @ApiPropertyOptional({
    enum: ImageType,
    description: 'Filtrar imagens por tipo',
    example: ImageType.PRODUCT,
  })
  @IsEnum(ImageType)
  @IsOptional()
  readonly type?: ImageType;
}
