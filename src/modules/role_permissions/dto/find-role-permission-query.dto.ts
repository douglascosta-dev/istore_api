import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDTO } from 'src/common/dto/pagination.dto';

export class FindRolePermissionQueryDTO extends PaginationQueryDTO {
  @IsString()
  @IsOptional()
  readonly name?: string;
}
