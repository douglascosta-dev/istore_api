import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cellphone } from './entities/cellphone.entity';
import { Repository } from 'typeorm';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { FindCellphoneQueryDTO } from './dto/find-cellphone-query.dto';
import { buildPaginatedResponse } from 'src/common/helpers/pagination.helper';
import { User } from '../users/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { CreateCellphoneDTO } from './dto/create-cellphone.dto';
import { UpdateCellphoneDTO } from './dto/update-cellphone.dto';
import { CellphoneUserResponse } from './dto/cellphone-users.response';

@Injectable()
export class CellphoneService {
  constructor(
    @InjectRepository(Cellphone)
    private readonly cellphoneRepository: Repository<Cellphone>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(
    query: FindCellphoneQueryDTO,
  ): Promise<PaginatedResponse<Cellphone>> {
    const { page = 1, limit = 300 } = query;
    const safeLimit = Math.min(limit, 100);
    const skip = (page - 1) * safeLimit;
    const qb = this.cellphoneRepository.createQueryBuilder('cellphone');

    if (query.number) {
      qb.andWhere('cellphone.number ILIKE :number', {
        number: `%${query.number}%`,
      });
    }

    qb.skip(skip).take(safeLimit);

    const [data, total] = await qb.getManyAndCount();
    const cellphones = buildPaginatedResponse(data, total, page, safeLimit);

    if (!cellphones)
      throw new HttpException(
        'Nenhum telefone encontrado',
        HttpStatus.NOT_FOUND,
      );

    return cellphones;
  }

  async findAllWithUsers(
    query: FindCellphoneQueryDTO,
  ): Promise<PaginatedResponse<CellphoneUserResponse>> {
    const { page = 1, limit = 300 } = query;
    const safeLimit = Math.min(limit, 100);
    const skip = (page - 1) * safeLimit;

    const qb = this.cellphoneRepository.createQueryBuilder('cellphone');

    qb.innerJoinAndSelect('cellphone.user', 'user');

    if (query.number) {
      qb.andWhere('cellphone.number ILIKE :number', {
        number: `%${query.number}%`,
      });
    }

    qb.skip(skip).take(safeLimit);

    const [data, total] = await qb.getManyAndCount();
    const cellphones = buildPaginatedResponse(data, total, page, safeLimit);

    if (!cellphones)
      throw new HttpException(
        'Nenhum telefone encontrado',
        HttpStatus.NOT_FOUND,
      );

    return {
      ...cellphones,
      data: plainToInstance(CellphoneUserResponse, cellphones.data, {
        excludeExtraneousValues: true,
      }),
    };
  }

  async findOne(id: string): Promise<Cellphone> {
    const cellphone = await this.cellphoneRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });

    if (!cellphone)
      throw new HttpException(
        'Nenhum telefone encontrado',
        HttpStatus.NOT_FOUND,
      );

    return cellphone;
  }

  async createOne(body: CreateCellphoneDTO): Promise<Cellphone> {
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

    const cellphone = this.cellphoneRepository.create({
      ...body,
      user,
    });

    return await this.cellphoneRepository.save(cellphone);
  }

  async updateOne(id: string, body: UpdateCellphoneDTO): Promise<Cellphone> {
    const cellphone = await this.cellphoneRepository.findOne({
      where: { id },
    });

    if (!cellphone)
      throw new HttpException(
        'Nenhum telefone encontrado',
        HttpStatus.NOT_FOUND,
      );

    const updatedCellphone = await this.cellphoneRepository.preload({
      id,
      ...body,
    });

    if (!updatedCellphone)
      throw new HttpException(
        'Erro ao atualizar celular',
        HttpStatus.BAD_REQUEST,
      );

    return await this.cellphoneRepository.save(updatedCellphone);
  }

  async deleteOne(id: string) {
    const cellphone = await this.cellphoneRepository.findOne({
      where: { id },
    });

    if (!cellphone)
      throw new HttpException(
        'Nenhum telefone encontrado',
        HttpStatus.NOT_FOUND,
      );

    return this.cellphoneRepository.delete(cellphone);
  }
}
