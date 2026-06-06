import { Expose, Transform } from 'class-transformer';
import { ImageType } from '../enum/image-type.enum';
import 'dotenv/config';

export class ImageResponse {
  @Expose()
  readonly id: string;
  @Expose()
  readonly type: ImageType;
  @Expose()
  @Transform(
    ({ obj }) => `${process.env.API_HOST}${obj.path.replace(/\\/g, '/')}`,
  )
  readonly url: string;
}
