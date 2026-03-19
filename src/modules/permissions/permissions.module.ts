import { Module } from '@nestjs/common';
import { PermissionController } from './permissions.controller';
import { PermissionService } from './permissions.service';
import { Permission } from './entities/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [],
})
export class PermissionModule {}
