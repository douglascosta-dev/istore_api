import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDTO } from './dto/create-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePermissionDTO } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}
  async findAll(): Promise<Permission[]> {
    return await this.permissionRepository.find();
  }

  async findOne(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: {
        id,
      },
    });
    if (!permission)
      throw new HttpException('Permissão não encontrada', HttpStatus.NOT_FOUND);
    return permission;
  }

  async createOne(body: CreatePermissionDTO): Promise<Permission> {
    const permission = this.permissionRepository.create({ ...body });
    if (!permission)
      throw new HttpException('Erro ao criar usuário', HttpStatus.BAD_REQUEST);
    return await this.permissionRepository.save(permission);
  }

  async updateOne(id: string, body: UpdatePermissionDTO): Promise<Permission> {
    const permission = await this.permissionRepository.preload({
      id: id,
      ...body,
    });
    if (!permission)
      throw new HttpException(
        'Falha ao atualizar Role. Role nao encontrada',
        HttpStatus.NOT_FOUND,
      );
    return await this.permissionRepository.save(permission);
  }

  async deleteOne(id: string) {
    return await this.permissionRepository.softDelete(id);
  }
}
