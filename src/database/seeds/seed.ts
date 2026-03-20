import { AppDataSource } from '../data-source';
import { runRolesSeed } from './roles.seed';

async function runSeeds() {
  await AppDataSource.initialize();
  console.log('Rodando seeds...');
  await runRolesSeed();
  console.log('Seeds finalizadas...');
  await AppDataSource.destroy();
}

runSeeds();
