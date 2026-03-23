import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { AppDataSource } from '../data-source';
import { Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { buildRolePermission } from 'src/common/helpers/role-permission.helper';
import { AdminPermissions } from 'src/common/constants/admin.permission';
import { DevPermissions } from 'src/common/constants/dev.permission';
import { TeamPermissions } from 'src/common/constants/team.permission';
import { SellerPermissions } from 'src/common/constants/seller.permission';
import { ClientPermissions } from 'src/common/constants/client.permission';

export async function runRolePermissionSeeds() {
  const permissionRepository: Repository<Permission> =
    AppDataSource.getRepository(Permission);
  const roleRepository: Repository<Role> = AppDataSource.getRepository(Role);

  const permissions: Permission[] = await permissionRepository.find();

  const permissionHash: Map<string, Permission> = new Map(
    permissions.map((permission) => [permission.name, permission]),
  );

  const adminRole: Role | null = await roleRepository.findOne({
    where: {
      name: 'admin',
    },
  });

  const devRole: Role | null = await roleRepository.findOne({
    where: {
      name: 'dev',
    },
  });

  const teamRole: Role | null = await roleRepository.findOne({
    where: {
      name: 'team',
    },
  });

  const sellerRole: Role | null = await roleRepository.findOne({
    where: {
      name: 'seller',
    },
  });

  const clientRole: Role | null = await roleRepository.findOne({
    where: {
      name: 'client',
    },
  });

  if (!adminRole || !devRole || !teamRole || !sellerRole || !clientRole) {
    throw new InternalServerErrorException();
  } else {
    console.log('Rodando AdminPermissions seeds...');
    await buildRolePermission(adminRole, AdminPermissions, permissionHash);
    console.log('Rodando DevPermissions seeds...');
    await buildRolePermission(devRole, DevPermissions, permissionHash);
    console.log('Rodando TeamPermissions seeds...');
    await buildRolePermission(teamRole, TeamPermissions, permissionHash);
    console.log('Rodando SellerPermissions seeds...');
    await buildRolePermission(sellerRole, SellerPermissions, permissionHash);
    console.log('Rodando ClientPermissions seeds...');
    await buildRolePermission(clientRole, ClientPermissions, permissionHash);
  }
}
