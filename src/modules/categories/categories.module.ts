import { Module } from '@nestjs/common';
import { CategoryController } from './categories.controller';
import { CategoryService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../images/entities/image.entity';
import { Category } from './entities/category.entity';
import { RolePermissionModule } from '../role_permissions/role-permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Image]), RolePermissionModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
