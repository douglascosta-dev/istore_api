import { OmitType } from '@nestjs/mapped-types';
import { CreateCellphoneDTO } from './create-cellphone.dto';

export class CreateCellphoneNestedDto extends OmitType(CreateCellphoneDTO, [
  'userId',
] as const) {}
