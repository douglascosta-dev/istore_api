import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ImageResponse } from 'src/modules/images/dto/image.response';

export class CategoryResponse {
  @ApiProperty({
    example: 'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a',
    description: 'ID da categoria (UUID)',
  })
  @Expose()
  readonly id: string;

  @ApiProperty({
    example: 'Smartphones',
    description: 'Nome da categoria',
  })
  @Expose()
  readonly name: string;

  @ApiProperty({
    example: true,
    description: 'Indica se a categoria está visível na loja',
  })
  @Expose()
  enabled: boolean;

  @ApiPropertyOptional({
    type: () => ImageResponse,
    description: 'Imagem vinculada à categoria',
  })
  @Expose()
  @Type(() => ImageResponse)
  readonly image?: ImageResponse;
}
