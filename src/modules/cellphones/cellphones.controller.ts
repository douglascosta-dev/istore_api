import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { CellphoneResponse } from './dto/cellphone.response';
import { FindCellphoneQueryDTO } from './dto/find-cellphone-query.dto';
import { CellphoneService } from './cellphones.service';
import { plainToInstance } from 'class-transformer';
import { CreateCellphoneDTO } from './dto/create-cellphone.dto';
import { UpdateCellphoneDTO } from './dto/update-cellphone.dto';
import { CellphoneUserResponse } from './dto/cellphone-users.response';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { RequirePermissions } from 'src/common/decorators/role-permission.decorator';

@Controller('cellphones')
@UseGuards(AuthGuard('jwt'), PermissionGuard)
export class CellphoneController {
  constructor(private readonly cellphoneService: CellphoneService) {}
  @RequirePermissions('read:cellphone')
  @Get()
  async findAll(
    @Query() query: FindCellphoneQueryDTO,
  ): Promise<PaginatedResponse<CellphoneResponse>> {
    const cellphones = await this.cellphoneService.findAll(query);
    return {
      ...cellphones,
      data: plainToInstance(CellphoneResponse, cellphones.data, {
        excludeExtraneousValues: true,
      }),
    };
  }
  @RequirePermissions('read:cellphone')
  @RequirePermissions('read:user')
  @Get('/users')
  async findOneWithUsers(
    @Query() query: FindCellphoneQueryDTO,
  ): Promise<PaginatedResponse<CellphoneUserResponse>> {
    return await this.cellphoneService.findAllWithUsers(query);
  }

  @RequirePermissions('read:cellphone')
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CellphoneUserResponse> {
    const cellphone = await this.cellphoneService.findOne(id);
    return plainToInstance(CellphoneUserResponse, cellphone, {
      excludeExtraneousValues: true,
    });
  }
  @RequirePermissions('create:cellphone')
  @Post()
  async createdOne(
    @Body() body: CreateCellphoneDTO,
  ): Promise<CellphoneResponse> {
    const cellphone = await this.cellphoneService.createOne(body);
    return plainToInstance(CellphoneResponse, cellphone, {
      excludeExtraneousValues: true,
    });
  }

  @RequirePermissions('update:cellphone')
  @Patch(':id')
  async updateOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateCellphoneDTO,
  ): Promise<CellphoneResponse> {
    const cellphone = await this.cellphoneService.updateOne(id, body);
    return plainToInstance(CellphoneResponse, cellphone, {
      excludeExtraneousValues: true,
    });
  }

  @RequirePermissions('delete:cellphone')
  @Delete(':id')
  async deleteOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.cellphoneService.deleteOne(id);
  }
}
