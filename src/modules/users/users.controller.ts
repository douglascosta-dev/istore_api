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
import { UserResponse } from './dto/user.response';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { UserService } from './users.service';
import { plainToInstance } from 'class-transformer';
import { FindUserQueryDTO } from './dto/find-user-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { CreateClientUserDTO } from './create-client-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { RequirePermissions } from 'src/common/decorators/role-permission.decorator';
@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @RequirePermissions('read:user')
  @Get()
  async findAll(
    @Query() query: FindUserQueryDTO,
  ): Promise<PaginatedResponse<UserResponse>> {
    const users = await this.userService.findAll(query);
    return {
      ...users,
      data: plainToInstance(UserResponse, users.data, {
        excludeExtraneousValues: true,
      }),
    };
  }
  @RequirePermissions('read:user')
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserResponse> {
    const user = await this.userService.findOne(id);
    return plainToInstance(UserResponse, user, {
      excludeExtraneousValues: true,
    });
  }
  @RequirePermissions('create:user')
  @Post()
  async createOne(@Body() body: CreateUserDto): Promise<UserResponse> {
    const user = await this.userService.createOne(body);
    return plainToInstance(UserResponse, user, {
      excludeExtraneousValues: true,
    });
  }

  @Post('client')
  async createClient(@Body() body: CreateClientUserDTO): Promise<UserResponse> {
    const user = await this.userService.createClient(body);
    return plainToInstance(UserResponse, user, {
      excludeExtraneousValues: true,
    });
  }
  @RequirePermissions('update:user')
  @Patch(':id')
  async updateOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateUserDTO,
  ): Promise<UserResponse> {
    const user = await this.userService.updateOne(id, body);
    return plainToInstance(UserResponse, user, {
      excludeExtraneousValues: true,
    });
  }
  @RequirePermissions('delete:user')
  @Delete(':id')
  async deleteOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.userService.deleteOne(id);
  }
}
