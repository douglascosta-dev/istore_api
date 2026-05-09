import { Module } from '@nestjs/common';
import { CellphoneController } from './cellphones.controller';
import { CellphoneService } from './cellphones.service';
import { Cellphone } from './entities/cellphone.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { RolePermissionModule } from '../role_permissions/role-permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cellphone, User]), RolePermissionModule],
  controllers: [CellphoneController],
  providers: [CellphoneService],
  exports: [],
})
export class CellphoneModule {}
