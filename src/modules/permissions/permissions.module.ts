import { Module } from '@nestjs/common';
import { PermissionController } from './permissions.controller';
import { PermissionService } from './permissions.service';
import { Permission } from './entities/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermissionModule } from '../role_permissions/role-permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), RolePermissionModule],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [],
})
export class PermissionModule {}
