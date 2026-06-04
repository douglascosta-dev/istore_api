import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ImageType } from '../enum/image-type.enum';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'enum',
    enum: ImageType,
  })
  type: ImageType;
  @Column({
    name: 'mime_type',
    type: 'varchar',
    length: 100,
  })
  mimeType: string;
  @Column({
    name: 'original_name',
    type: 'varchar',
    length: 255,
  })
  originalName: string;
  @Column({
    name: 'server_name',
    type: 'varchar',
    length: 255,
  })
  serverName: string;
  @Column({
    type: 'varchar',
    length: 255,
  })
  path: string;
  @Column({
    type: 'integer',
  })
  size: number;
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
