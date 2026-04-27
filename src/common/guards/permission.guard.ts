import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolePermissionService } from 'src/modules/role_permissions/role-permission.service';
import { PERMISSIONS_KEY } from '../decorators/role-permission.decorator';
import { UserRequestToken } from 'src/modules/auth/dtos/user-requet-token.response';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rolePermissionService: RolePermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user }: UserRequestToken = context.switchToHttp().getRequest();

    if (!user || !user.role) return false;
    if (user.role === 'admin') return true;
    for (const requiredPermission of requiredPermissions) {
      const hasPermission = await this.rolePermissionService.hasPermission(
        user.role,
        requiredPermission,
      );
      if (!hasPermission) {
        throw new HttpException(
          `Acesso negado, requer permissão do tipo ${requiredPermission}`,
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
    return true;
  }
}
