import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDTO } from 'src/common/dto/pagination.dto';

export class FindUserQueryDTO extends PaginationQueryDTO {
  @ApiPropertyOptional({
    description: 'Filtrar por nome do usuário',
    example: 'João',
  })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por e-mail do usuário',
    example: 'joao@email.com',
  })
  @IsString()
  @IsOptional()
  readonly email?: string;
}
