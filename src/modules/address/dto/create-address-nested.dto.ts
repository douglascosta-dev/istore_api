import { OmitType } from '@nestjs/mapped-types';
import { CreateAddressDTO } from './create-adress.dto';

export class CreateAddressNestedDto extends OmitType(CreateAddressDTO, [
  'userId',
] as const) {}
