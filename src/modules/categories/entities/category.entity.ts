import { Image } from 'src/modules/images/entities/image.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'categories',
  orderBy: {
    order: 'ASC',
  },
})
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  name: string;
  @Column({
    default: true,
  })
  enabled: boolean;
  @Column()
  order: number;
  @OneToOne(() => Image, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'image_id' })
  image: Image;
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
