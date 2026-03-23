import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { AppDataSource } from '../data-source';

export async function runPermissionsSeeds() {
  const repository = AppDataSource.getRepository(Permission);

  const permissions: string[] = [
    /* ALL */
    '*',

    /* AUTH */
    'login:auth',
    'refresh:auth',
    'logout:auth',
    'forgot-password:auth',
    'reset-password:auth',

    /* USERS */
    'create:user',
    'read:user',
    'update:user',
    'delete:user',

    /* CELLPHONES */
    'create:cellphone',
    'read:cellphone',
    'update:cellphone',
    'delete:cellphone',

    /* ADDRESS */
    'create:address',
    'read:address',
    'update:address',
    'delete:address',

    /* ROLES */
    'create:role',
    'read:role',
    'update:role',
    'delete:role',

    /* PERMISSIONS */
    'create:permission',
    'read:permission',
    'update:permission',
    'delete:permission',

    /* PRODUCTS */
    'create:product',
    'read:product',
    'update:product',
    'delete:product',

    /* CATEGORIES */
    'create:category',
    'read:category',
    'update:category',
    'delete:category',

    /* CART */
    'create:cart',
    'read:cart',
    'update:cart',
    'delete:cart',

    /* ORDERS */
    'create:order',
    'read:order',
    'update:order',
    'delete:order',
    'approve:order',
    'finish:order',
    'cancel:order',

    /* TICKETS */
    'create:ticket',
    'read:ticket',
    'update:ticket',
    'delete:ticket',
    'answer:ticket',

    /* FINANCE */
    'read:finance',
    'update:finance',
  ];
  let hasCreatedPermission: boolean = false;
  for (const permission of permissions) {
    const existPermission: Permission | null = await repository.findOne({
      where: { name: permission },
    });
    if (!existPermission) {
      if (!hasCreatedPermission) {
        console.log('Rodando Permissions Seeds');
        hasCreatedPermission = true;
      }
      const payload: Record<string, string> = {
        name: permission,
      };
      await repository.save(payload);
    }
  }
}
