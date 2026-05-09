import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolePermission } from './entity/role-permission.entity';
import { Repository } from 'typeorm';
import { Permission } from '../permissions/entities/permission.entity';
import { Role } from '../roles/entities/role.entity';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDTO } from './dto/update-role-permission.dto';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { SelectQueryBuilder } from 'typeorm/browser';
import { FindRolePermissionQueryDTO } from './dto/find-role-permission-query.dto';
import { buildPaginatedResponse } from 'src/common/helpers/pagination.helper';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async findAll(
    query: FindRolePermissionQueryDTO,
  ): Promise<PaginatedResponse<RolePermission>> {
    const { page = 1 as number, limit = 30 as number } = query;
    const safeLimit: number = Math.min(limit, 100);
    const skip: number = (page - 1) * safeLimit;
    const qb: SelectQueryBuilder<RolePermission> =
      this.rolePermissionRepository.createQueryBuilder('role_permission');

    qb.leftJoinAndSelect('role_permission.role', 'role').leftJoinAndSelect(
      'role_permission.permission',
      'permission',
    );

    if (query.name)
      qb.andWhere('role.name ILIKE :name', {
        name: `%${query.name}%`,
      });

    qb.skip(skip).take(safeLimit);

    const [data, total] = await qb.getManyAndCount();

    const rolePermissions = buildPaginatedResponse(
      data,
      page,
      safeLimit,
      total,
    );

    if (!rolePermissions)
      throw new HttpException(
        'Nenhuma role_permission encontrada',
        HttpStatus.NOT_FOUND,
      );
    return rolePermissions;
  }

  async findOne(id: string): Promise<RolePermission> {
    const rolePermission = await this.rolePermissionRepository.findOne({
      where: {
        id,
      },
      relations: ['role', 'permission'],
    });
    if (!rolePermission)
      throw new HttpException(
        'Nenhuma role_permission encontrada',
        HttpStatus.NOT_FOUND,
      );
    return rolePermission;
  }

  async createOne(body: CreateRolePermissionDto): Promise<RolePermission> {
    const role = await this.roleRepository.findOne({
      where: { id: body.roleId },
    });
    const permission = await this.permissionRepository.findOne({
      where: { id: body.permissionId },
    });

    if (!role)
      throw new HttpException(
        'Nenhuma Role encontrada com esse ID',
        HttpStatus.NOT_FOUND,
      );
    else if (!permission)
      throw new HttpException(
        'Nenhuma Permission encontrada com esse ID',
        HttpStatus.NOT_FOUND,
      );
    const rolePermission = this.rolePermissionRepository.create({
      role: role,
      permission: permission,
    });
    return await this.rolePermissionRepository.save(rolePermission);
  }

  async updateOne(
    id: string,
    body: UpdateRolePermissionDTO,
  ): Promise<RolePermission> {
    const rolePermission = await this.rolePermissionRepository.preload({
      id,
      ...body,
    });
    if (!rolePermission)
      throw new HttpException(
        'Falha ao atualizar Role. Role nao encontrada',
        HttpStatus.NOT_FOUND,
      );
    return await this.rolePermissionRepository.save(rolePermission);
  }

  async deleteOne(id: string) {
    return await this.rolePermissionRepository.delete(id);
  }

  async hasPermission(
    roleName: string,
    permissionName: string,
  ): Promise<boolean> {
    const rolePermission = await this.rolePermissionRepository.findOne({
      where: {
        role: { name: roleName },
        permission: { name: permissionName },
      },
      relations: ['roles', 'permissions'],
    });
    return !!rolePermission;
  }
}
