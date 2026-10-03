import { OmitType } from '@nestjs/swagger';
import { CreateAddressDTO } from './create-adress.dto';

export class CreateAddressNestedDto extends OmitType(CreateAddressDTO, [
  'userId',
] as const) {}
