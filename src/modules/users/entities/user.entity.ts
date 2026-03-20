import { Address } from 'src/modules/address/entities/address.entity';
import { Cellphone } from 'src/modules/cellphones/entities/cellphone.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users', {
  orderBy: {
    firstName: 'ASC',
  },
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  firstName: string;
  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  lastName: string;
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  email: string;
  @OneToMany(() => Cellphone, (cellphone) => cellphone.user, {
    cascade: true,
    orphanedRowAction: 'soft-delete',
  })
  cellphones: Cellphone[];
  @OneToMany(() => Address, (address) => address.user, {
    cascade: true,
    orphanedRowAction: 'soft-delete',
  })
  address: Address[];
  @Column({
    type: 'varchar',
    length: 11,
    unique: true,
    nullable: false,
  })
  cpf: string;
  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
    nullable: false,
    select: false,
  })
  passwordHash: string;
  @Index()
  @ManyToOne(() => Role, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;
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
