import { Role } from 'src/modules/roles/entities/role.entity';
import { AppDataSource } from '../data-source';

export async function runRolesSeed() {
  const repository = AppDataSource.getRepository(Role);
  const roles: Record<string, string>[] = [
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
  let hasCreatedRole: boolean = false;
  for (const role of roles) {
    const existRole: Role | null = await repository.findOne({
      where: { name: role.name },
    });
    if (!existRole) {
      if (!hasCreatedRole) {
        console.log('Roles:');
        hasCreatedRole = true;
      }
      console.log(role);
      await repository.save(role);
    }
  }
}
