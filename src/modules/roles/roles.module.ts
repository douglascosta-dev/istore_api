import { Module } from '@nestjs/common';
import { RoleController } from './roles.controller';
import { RoleService } from './roles.service';

@Module({
  imports: [],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [],
})
export class RoleModule {}
