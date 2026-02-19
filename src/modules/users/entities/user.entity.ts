import { Role } from 'src/modules/roles/entities/role.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users', {
  orderBy: {
    first_name: 'ASC',
  },
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  first_name: string;
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  last_name: string;
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  email: string;
  @Column({
    type: 'varchar',
    length: 11,
    unique: true,
    nullable: false,
  })
  cpf: string;
  @Column({
    type: 'varchar',
    length: 11,
    nullable: false,
  })
  cellphone: string;
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    select: false,
  })
  password_hash: string;
  @ManyToOne(() => Role, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
  @DeleteDateColumn()
  deleted_at: Date;
}
