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
import { ChangeUserPassword } from './dto/change-user-password.dto';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(query: FindUserQueryDTO): Promise<PaginatedResponse<User>> {
    const { page = 1, limit = 30 } = query;
    const safeLimit = Math.min(limit, 100);
    const skip = (page - 1) * safeLimit;
    const qb = this.userRepository.createQueryBuilder('user');

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
    const user = await this.userRepository.findOne({
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
    const passwordHash = await bcrypt.hash(body.password, 10);
    const role = await this.roleRepository.findOne({
      where: { id: body.roleId },
    });
    if (!role) {
      throw new HttpException('Role inválida', HttpStatus.BAD_REQUEST);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = body;
    const user = this.userRepository.create({
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

  async updateOne(id: string, body: UpdateUserDTO): Promise<User> {
    let role: Role | undefined;
    if (body.role) {
      const foundRole = await this.roleRepository.findOne({
        where: { name: body.role },
      });
      if (!foundRole) {
        throw new HttpException('Role inválida', HttpStatus.BAD_REQUEST);
      }
      role = foundRole;
    }

    const user = await this.userRepository.preload({
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

  async deleteOne(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    return await this.userRepository.remove(user);
  }

  async changeUserPassword(
    id: string,
    body: ChangeUserPassword,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      select: ['id', 'passwordHash'],
    });
    if (!user)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    const passwordMatch = await bcrypt.compare(
      body.currentPassword,
      user.passwordHash,
    );

    if (!passwordMatch)
      throw new HttpException('Senha atual incorreta', HttpStatus.BAD_REQUEST);

    const newPasswordHash = await bcrypt.hash(body.newPassword, 10);
    user.passwordHash = newPasswordHash;
    await this.userRepository.save(user);
  }
}
