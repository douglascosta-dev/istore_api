import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDTO } from 'src/common/dto/pagination.dto';

export class FindAddressQueryDTO extends PaginationQueryDTO {
  @IsString()
  @IsOptional()
  readonly zipcode?: string;
  @IsString()
  @IsOptional()
  readonly street?: string;
  @IsString()
  @IsOptional()
  readonly neighborhood?: string;
  @IsString()
  @IsOptional()
  readonly city?: string;
  @IsString()
  @IsOptional()
  readonly state?: string;
}
