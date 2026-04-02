import { PartialType } from '@nestjs/mapped-types';
import { CreateAddressDTO } from './create-adress.dto';

export class UpdateAdressDTO extends PartialType(CreateAddressDTO) {}
