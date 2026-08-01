import { IsOptional } from 'class-validator';
import { PaginationQueryDTO } from 'src/common/dto/pagination.dto';

export class FindCategoryQueryDTO extends PaginationQueryDTO {
  @IsOptional()
  name: string;
}
