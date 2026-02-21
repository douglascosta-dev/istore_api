import { PartialType } from '@nestjs/mapped-types';
import { CreateCellphoneDTO } from './create-cellphone.dto';

export class UpdateCellphoneDTO extends PartialType(CreateCellphoneDTO) {}
