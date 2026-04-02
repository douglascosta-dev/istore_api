import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { FindRolesQueryDTO } from './dto/find-role-query.dto';
import { buildPaginatedResponse } from 'src/common/helpers/pagination.helper';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { CreateRoleDTO } from './dto/create-role.dto';
import { UpdateRoleDTO } from './dto/update-role.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(query: FindRolesQueryDTO): Promise<PaginatedResponse<Role>> {
    const { page = 1, limit = 30 } = query;
    const safeLimit = Math.min(limit, 100);
    const skip = (page - 1) * safeLimit;
    const qb = this.roleRepository.createQueryBuilder('role');

    if (query.name)
      qb.andWhere('role.name ILIKE :name', {
        name: `%${query.name}%`,
      });

    qb.skip(skip).take(safeLimit);

    const [data, total] = await qb.getManyAndCount();

    const roles = buildPaginatedResponse(data, total, page, safeLimit);

    if (roles) return roles;
    throw new HttpException('Nenhuma role encontrada!', HttpStatus.NOT_FOUND);
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
    });
    if (role) return role;
    throw new HttpException('Nenhuma role encontrada!', HttpStatus.NOT_FOUND);
  }

  async findOneWithUsers(
    id: string,
    query: FindRolesQueryDTO,
  ): Promise<PaginatedResponse<User>> {
    const { page = 1, limit = 30 } = query;
    const safeLimit: number = Math.min(limit, 100);
    const skip = (page - 1) * safeLimit;

    const qb = this.userRepository.createQueryBuilder('user');
    qb.innerJoin('user.role', 'role')
      .where('role.id = :id', { id })
      .skip(skip)
      .take(safeLimit);

    const [data, total] = await qb.getManyAndCount();

    const roleUsers = buildPaginatedResponse(data, total, page, safeLimit);

    if (roleUsers) return roleUsers;

    throw new HttpException('Nenhuma role encontrada!', HttpStatus.NOT_FOUND);
  }

  async createOne(dto: CreateRoleDTO): Promise<Role> {
    const role = this.roleRepository.create({
      ...dto,
    });
    if (role) return this.roleRepository.save(role);
    throw new HttpException(
      'Falha ao criar role! Verifique os campos e tente novamente',
      HttpStatus.BAD_REQUEST,
    );
  }

  async updateOne(id: string, dto: UpdateRoleDTO): Promise<Role> {
    const role = await this.roleRepository.preload({
      id: id,
      ...dto,
    });
    if (!role)
      throw new HttpException(
        'Falha ao atualizar Role. Role nao encontrada',
        HttpStatus.NOT_FOUND,
      );
    return await this.roleRepository.save(role);
  }

  async deleteOne(id: string) {
    return this.roleRepository.softDelete(id);
  }
}
