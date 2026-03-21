import { AppDataSource } from '../data-source';
import { runPermissionsSeeds } from './permissions.seed';
import { runRolesSeed } from './roles.seed';

async function runSeeds() {
  await AppDataSource.initialize();
  console.log('Rodando seeds...');
  await runRolesSeed();
  await runPermissionsSeeds();
  console.log('Seeds finalizadas...');
  await AppDataSource.destroy();
}

runSeeds();
