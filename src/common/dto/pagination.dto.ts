import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDTO {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  readonly page?: number;
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(30)
  @Max(100)
  readonly limit?: number;
}
