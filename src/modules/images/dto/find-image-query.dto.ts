import { IsOptional } from 'class-validator';
import { PaginationQueryDTO } from 'src/common/dto/pagination.dto';
import { ImageType } from '../enum/image-type.enum';

export class FindImageQueryDTO extends PaginationQueryDTO {
  @IsOptional()
  readonly type: ImageType;
}
