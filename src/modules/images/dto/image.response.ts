import { Expose } from 'class-transformer';
import { ImageType } from '../enum/image-type.enum';

export class ImageResponse {
  @Expose()
  readonly id: string;
  @Expose()
  readonly type: ImageType;
  @Expose()
  readonly url: string;
}
