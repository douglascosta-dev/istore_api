import { User } from 'src/modules/users/entities/user.entity';
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

@Entity('cellphones')
export class Cellphone {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  number: string;
  @Index()
  @ManyToOne(() => User, (user) => user.cellphones, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
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
