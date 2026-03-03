import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationQueryDTO {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  readonly page?: number = 1;
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(30)
  @Max(100)
  readonly limit?: number = 30;
}
