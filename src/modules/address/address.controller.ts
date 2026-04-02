import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressResponse } from './dto/address.response';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { FindAddressQueryDTO } from './dto/find-address-query.dto';
import { plainToInstance } from 'class-transformer';
import { CreateAddressDTO } from './dto/create-adress.dto';
import { UpdateAdressDTO } from './dto/update-adress.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}
  @Get()
  async findAll(
    @Query() query: FindAddressQueryDTO,
  ): Promise<PaginatedResponse<AddressResponse>> {
    const address = await this.addressService.findAll(query);
    return {
      ...address,
      data: plainToInstance(AddressResponse, address.data, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<AddressResponse> {
    const address = await this.addressService.findOne(id);
    return plainToInstance(AddressResponse, address, {
      excludeExtraneousValues: true,
    });
  }

  @Post()
  async createOne(@Body() body: CreateAddressDTO): Promise<AddressResponse> {
    const address = await this.addressService.createOne(body);
    return plainToInstance(AddressResponse, address, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  async updateOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateAdressDTO,
  ): Promise<AddressResponse> {
    const address = await this.addressService.updateOne(id, body);
    return plainToInstance(AddressResponse, address, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  async deleteOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.addressService.deleteOne(id);
  }
}
