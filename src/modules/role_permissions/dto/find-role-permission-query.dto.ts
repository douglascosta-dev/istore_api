import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDTO } from 'src/common/dto/pagination.dto';

export class FindRolePermissionQueryDTO extends PaginationQueryDTO {
  @ApiPropertyOptional({
    description: 'Filtrar por nome',
    example: 'ADMIN',
  })
  @IsString()
  @IsOptional()
  readonly name?: string;
}
