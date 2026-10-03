import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDTO } from 'src/common/dto/pagination.dto';

export class FindRolesQueryDTO extends PaginationQueryDTO {
  @ApiPropertyOptional({
    description: 'Filtrar por nome da role',
    example: 'ADMIN',
  })
  @IsString()
  @IsOptional()
  readonly name?: string;
}
