import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { FindAddressQueryDTO } from './dto/find-address-query.dto';
import { AddressResponse } from './dto/address.response';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { buildPaginatedResponse } from 'src/common/helpers/pagination.helper';
import { CreateAddressDTO } from './dto/create-adress.dto';
import { UpdateAdressDTO } from './dto/update-adress.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(
    query: FindAddressQueryDTO,
  ): Promise<PaginatedResponse<Address>> {
    const { page = 1, limit = 30 } = query;
    const safeLimit = Math.min(limit, 100);
    const skip = (page - 1) * safeLimit;
    const qb = this.addressRepository.createQueryBuilder('address');

    if (query.zipcode) {
      qb.andWhere('address.zipcode ILIKE :zipcode', {
        zipcode: `%${query.zipcode}%`,
      });
    }

    if (query.street) {
      qb.andWhere('address.street ILIKE :street', {
        street: `%${query.street}%`,
      });
    }

    if (query.neighborhood) {
      qb.andWhere('address.neighborhood ILIKE :neighborhood', {
        neighborhood: `%${query.neighborhood}%`,
      });
    }

    if (query.city) {
      qb.andWhere('address.city ILIKE :city', {
        city: `%${query.city}%`,
      });
    }

    if (query.state) {
      qb.andWhere('address.state ILIKE :state', {
        state: `%${query.state}%`,
      });
    }

    qb.skip(skip).take(safeLimit);

    const [data, total] = await qb.getManyAndCount();
    const address = buildPaginatedResponse(data, total, page, safeLimit);

    if (address) return address;

    throw new HttpException('Nenhum endereço encontrado', HttpStatus.NOT_FOUND);
  }

  async findOne(id: string): Promise<AddressResponse> {
    const address = await this.addressRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });
    if (address) return address;
    throw new HttpException(
      'Nenhum endereço encontrado com este ID',
      HttpStatus.NOT_FOUND,
    );
  }

  async createOne(body: CreateAddressDTO): Promise<AddressResponse> {
    const user = await this.userRepository.findOne({
      where: {
        id: body.userId,
      },
    });
    if (!user)
      throw new HttpException(
        'Nenhum usuário encontrado para este ID',
        HttpStatus.NOT_FOUND,
      );
    const address = this.addressRepository.create({ ...body, user });
    return await this.addressRepository.save(address);
  }

  async updateOne(id: string, body: UpdateAdressDTO): Promise<AddressResponse> {
    const updateAdress = await this.addressRepository.preload({
      id: id,
      ...body,
    });

    if (!updateAdress)
      throw new HttpException('Endereço não encontrado!', HttpStatus.NOT_FOUND);

    return await this.addressRepository.save(updateAdress);
  }

  async deleteOne(id: string) {
    const address = await this.addressRepository.findOne({
      where: {
        id,
      },
    });
    if (!address)
      throw new HttpException('Endereço não encontrado', HttpStatus.NOT_FOUND);
    return await this.addressRepository.delete(address);
  }
}
