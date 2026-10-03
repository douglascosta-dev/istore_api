import { PartialType } from '@nestjs/swagger';
import { CreateAddressDTO } from './create-adress.dto';

export class UpdateAdressDTO extends PartialType(CreateAddressDTO) {}
