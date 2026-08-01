import { Expose, Type } from 'class-transformer';
import { ImageResponse } from 'src/modules/images/dto/image.response';

export class CategoryResponse {
  @Expose()
  readonly id: string;
  @Expose()
  readonly name: string;
  @Expose()
  @Type(() => ImageResponse)
  readonly image: ImageResponse;
}
