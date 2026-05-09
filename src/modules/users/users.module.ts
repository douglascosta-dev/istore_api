import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/entities/role.entity';
import { User } from './entities/user.entity';
import { RolePermissionModule } from '../role_permissions/role-permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User]), RolePermissionModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UserModule {}
