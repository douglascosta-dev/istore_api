import { User } from 'src/modules/users/entities/user.entity';
import { RelationId } from 'typeorm';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('address')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'varchar',
    length: 8,
    nullable: false,
  })
  zipcode: string;
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  street: string;
  @Column({
    type: 'int',
    nullable: false,
  })
  number: number;
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  complement: string;
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  neighborhood: string;
  @Index()
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  city: string;
  @Index()
  @Column({
    type: 'char',
    length: 2,
    nullable: false,
  })
  state: string;
  @Column({
    type: 'boolean',
    default: true,
  })
  default: boolean;
  @ManyToOne(() => User, (user) => user.address, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @RelationId((address: Address) => address.user)
  userId: string;
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
