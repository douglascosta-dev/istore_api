import { AppDataSource } from '../data-source';
import { runPermissionsSeeds } from './permissions.seed';
import { runRolePermissionSeeds } from './role-permission.seed';
import { runRolesSeed } from './roles.seed';

async function runSeeds() {
  await AppDataSource.initialize();
  console.log('Rodando seeds...');
  await runRolesSeed();
  await runPermissionsSeeds();
  await runRolePermissionSeeds();
  console.log('Seeds finalizadas...');
  await AppDataSource.destroy();
}

runSeeds();
