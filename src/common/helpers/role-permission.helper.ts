import { AppDataSource } from 'src/database/data-source';
import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { RolePermission } from 'src/modules/role_permissions/entity/role-permission.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { Repository } from 'typeorm';

export async function buildRolePermission(
  role: Role,
  rolePermissions: string[],
  permissionHash: Map<string, Permission>,
) {
  const rolePermissionRepository: Repository<RolePermission> =
    AppDataSource.getRepository(RolePermission);

  for (const rolePermission of rolePermissions) {
    const permission: Permission | undefined =
      permissionHash.get(rolePermission);
    if (!permission) continue;

    const existPermission: RolePermission | null =
      await rolePermissionRepository.findOne({
        where: {
          role: { id: role.id },
          permission: { id: permission.id },
        },
      });

    if (!existPermission) {
      const payload = {
        role: role,
        permission: permission,
      };
      await rolePermissionRepository.save(payload);
    }
  }
}
