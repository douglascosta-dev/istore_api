import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDTO } from 'src/common/dto/pagination.dto';

export class FindCellphoneQueryDTO extends PaginationQueryDTO {
  @IsString()
  @IsOptional()
  readonly number?: string;
}
