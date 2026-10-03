import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationQueryDTO {
  @ApiPropertyOptional({
    description: 'Número da página',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  readonly page?: number = 1;

  @ApiPropertyOptional({
    description: 'Quantidade de registros por página',
    default: 30,
    minimum: 30,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(30)
  @Max(100)
  readonly limit?: number = 30;
}
