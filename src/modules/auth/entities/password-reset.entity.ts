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

@Entity('password_reset')
@Unique(['user'])
export class PasswordReset {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @OneToOne(() => User, (user) => user)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @RelationId((userPassword: PasswordReset) => userPassword.user)
  userId: string;
  @Column({
    name: 'token_id',
  })
  tokenId: string;
  @Column({
    name: 'reset_password_token_hash',
    select: false,
  })
  resetPasswordTokenHash: string;
  @Column({
    name: 'expires_at',
  })
  expiresAt: Date;
}
