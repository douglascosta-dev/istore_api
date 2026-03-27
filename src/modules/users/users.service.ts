import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { FindUserQueryDTO } from './dto/find-user-query.dto';
import { buildPaginatedResponse } from 'src/common/helpers/pagination.helper';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { Role } from '../roles/entities/role.entity';
import { SelectQueryBuilder } from 'typeorm/browser';
import { CreateClientUserDTO } from './create-client-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(query: FindUserQueryDTO): Promise<PaginatedResponse<User>> {
    const { page = 1 as number, limit = 30 as number } = query;
    const safeLimit: number = Math.min(limit, 100);
    const skip: number = (page - 1) * safeLimit;
    const qb: SelectQueryBuilder<User> =
      this.userRepository.createQueryBuilder('user');

    if (query.name) {
      qb.andWhere('user.firstName ILIKE :name', {
        name: `%${query.name}%`,
      });
    }

    if (query.email) {
      qb.andWhere('user.email ILIKE :email', {
        email: `%${query.email}%`,
      });
    }

    qb.skip(skip).take(safeLimit);

    const [data, total] = await qb.getManyAndCount();
    const users = buildPaginatedResponse(data, total, page, safeLimit);
    if (!users)
      throw new HttpException(
        'Nenhum usuário encontrado',
        HttpStatus.NOT_FOUND,
      );
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user: User | null = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['role', 'cellphones', 'address'],
    });

    if (!user)
      throw new HttpException(
        'Nenhum usuário encontrado',
        HttpStatus.NOT_FOUND,
      );

    return user;
  }

  async createOne(body: CreateUserDto): Promise<User> {
    const passwordHash: string = await bcrypt.hash(body.password, 10);
    const role: Role | null = await this.roleRepository.findOne({
      where: { id: body.roleId },
    });

    if (!role) {
      throw new HttpException('Role inválida', HttpStatus.BAD_REQUEST);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = body;
    const user: User = this.userRepository.create({
      ...userData,
      passwordHash,
      cellphones: body.cellphones,
      address: body.address,
      role: role,
    });

    if (!user)
      throw new HttpException('Falha ao criar usuário', HttpStatus.BAD_REQUEST);

    return await this.userRepository.save(user);
  }

  async createClient(body: CreateClientUserDTO): Promise<User> {
    const clientRole: Role | null = await this.roleRepository.findOne({
      where: { name: 'client' },
    });

    if (!clientRole)
      throw new HttpException(
        'Nenhuma role encontrada',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    if (!body.password)
      throw new HttpException('Senha é obrigatorio', HttpStatus.BAD_REQUEST);

    const passwordHash: string = await bcrypt.hash(body.password, 10);
    const user: User = this.userRepository.create({
      ...body,
      passwordHash: passwordHash,
      cellphones: body.cellphones,
      address: body.address,
      role: clientRole,
    });
    return await this.userRepository.save(user);
  }

  async updateOne(id: string, body: UpdateUserDTO): Promise<User> {
    let role: Role | undefined;
    if (body.role) {
      const foundRole: Role | null = await this.roleRepository.findOne({
        where: { name: body.role },
      });

      if (!foundRole) {
        throw new HttpException('Role inválida', HttpStatus.BAD_REQUEST);
      }
      role = foundRole;
    }

    const user: User | undefined = await this.userRepository.preload({
      id: id,
      ...body,
      cellphones: body.cellphones,
      address: body.address,
      role: role,
    });

    if (!user)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    return await this.userRepository.save(user);
  }

  async deleteOne(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['cellphones', 'address'],
    });
    if (!user)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    await this.userRepository.remove(user);
  }
}
