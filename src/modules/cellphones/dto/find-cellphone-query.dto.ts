import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { PaginationQueryDTO } from 'src/common/dto/pagination.dto';

export class FindCellphoneQueryDTO extends PaginationQueryDTO {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  readonly number?: number;
}
