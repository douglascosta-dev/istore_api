import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolePermission } from './entity/role-permission.entity';
import { Repository } from 'typeorm';
import { Permission } from '../permissions/entities/permission.entity';
import { Role } from '../roles/entities/role.entity';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDTO } from './dto/update-role-permission.dto';

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

  async findAll(): Promise<RolePermission[]> {
    const rolePermissions = await this.rolePermissionRepository.find({
      relations: ['role', 'permission'],
    });
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
}
