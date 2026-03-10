import { Module } from '@nestjs/common';
import { CellphoneController } from './cellphones.controller';
import { CellphoneService } from './cellphones.service';
import { Cellphone } from './entities/cellphone.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cellphone, User])],
  controllers: [CellphoneController],
  providers: [CellphoneService],
  exports: [],
})
export class CellphoneModule {}
