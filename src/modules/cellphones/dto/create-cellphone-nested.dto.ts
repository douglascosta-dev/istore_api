import { OmitType } from '@nestjs/swagger';
import { CreateCellphoneDTO } from './create-cellphone.dto';

export class CreateCellphoneNestedDto extends OmitType(CreateCellphoneDTO, [
  'userId',
] as const) {}
