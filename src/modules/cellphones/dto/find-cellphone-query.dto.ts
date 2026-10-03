import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDTO } from 'src/common/dto/pagination.dto';

export class FindCellphoneQueryDTO extends PaginationQueryDTO {
  @ApiPropertyOptional({
    description: 'Filtrar por número de telefone',
    example: '11987654321',
  })
  @IsString()
  @IsOptional()
  readonly number?: string;
}
