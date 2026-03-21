import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
} from 'typeorm';

@Entity('password-reset')
@Unique(['user'])
export class PasswordReset {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @OneToOne(() => User, (user) => user)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @RelationId((userPassword: PasswordReset) => userPassword.user)
  userId: string;
  @Column()
  resetPasswordTokenHash: string;
  @Column()
  expiresAt: Date;
}
