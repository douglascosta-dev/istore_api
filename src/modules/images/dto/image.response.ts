import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { ImageType } from '../enum/image-type.enum';
import 'dotenv/config';

export class ImageResponse {
  @ApiProperty({
    example: 'b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID da imagem (UUID)',
  })
  @Expose()
  readonly id: string;

  @ApiProperty({
    enum: ImageType,
    example: ImageType.PRODUCT,
    description: 'Tipo da imagem enviada',
  })
  @Expose()
  readonly type: ImageType;

  @ApiProperty({
    example: 'http://localhost:3000/uploads/product/image-uuid.jpg',
    description: 'URL completa para visualização da imagem',
  })
  @Expose()
  @Transform(
    ({ obj }) => `${process.env.API_HOST}${obj.path.replace(/\\/g, '/')}`,
  )
  readonly url: string;
}
