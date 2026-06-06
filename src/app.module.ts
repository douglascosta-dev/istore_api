import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/users/users.module';
import { RoleModule } from './modules/roles/roles.module';
import { CellphoneModule } from './modules/cellphones/cellphones.module';
import { AddressModule } from './modules/address/address.module';
import { PermissionModule } from './modules/permissions/permissions.module';
import { RolePermissionModule } from './modules/role_permissions/role-permission.module';
import { AuthModule } from './modules/auth/auth.module';
import { ImageModule } from './modules/images/images.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
        migrationsRun: false,
      }),
    }),
    RoleModule,
    UserModule,
    CellphoneModule,
    AddressModule,
    PermissionModule,
    RolePermissionModule,
    AuthModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
