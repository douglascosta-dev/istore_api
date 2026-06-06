import { Module } from '@nestjs/common';
import { ImageController } from './images.controller';
import { ImageService } from './images.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { RolePermissionModule } from '../role_permissions/role-permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([Image]), RolePermissionModule],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
