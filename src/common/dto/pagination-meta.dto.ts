import { ApiProperty } from '@nestjs/swagger';
import { PaginationMeta } from '../interfaces/pagination-meta.interface';

export class PaginationMetaDTO implements PaginationMeta {
  @ApiProperty({ example: 100, description: 'Total de itens encontrados' })
  readonly total: number;

  @ApiProperty({ example: 1, description: 'Página atual' })
  readonly page: number;

  @ApiProperty({ example: 30, description: 'Quantidade de itens por página' })
  readonly limit: number;

  @ApiProperty({ example: 4, description: 'Total de páginas' })
  readonly totalPages: number;

  @ApiProperty({ example: false, description: 'Indica se há página anterior' })
  readonly hasPreviousPage: boolean;

  @ApiProperty({ example: true, description: 'Indica se há próxima página' })
  readonly hasNextPage: boolean;
}
