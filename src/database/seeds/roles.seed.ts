import { Role } from 'src/modules/roles/entities/role.entity';
import { AppDataSource } from '../data-source';

export async function runRolesSeed() {
  const repository = AppDataSource.getRepository(Role);
  const roles = [
    {
      name: 'admin',
    },
    {
      name: 'dev',
    },
    {
      name: 'team',
    },
    {
      name: 'seller',
    },
    {
      name: 'client',
    },
  ];
  for (const role of roles) {
    const existRole = await repository.findOne({
      where: { name: role.name },
    });
    if (!existRole) await repository.save(role);
  }
}
