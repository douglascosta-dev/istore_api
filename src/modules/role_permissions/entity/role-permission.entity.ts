import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('role_permissions')
@Unique(['role', 'permission'])
export class RolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Role, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  @Index()
  role: Role;
  @RelationId((rp: RolePermission) => rp.role)
  roleId: string;
  @ManyToOne(() => Permission, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'permission_id' })
  @Index()
  permission: Permission;
  @RelationId((rp: RolePermission) => rp.permission)
  permissionId: string;
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date;
}
