import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../../constants';

@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    //Если в метаданных не указаны требуемые поля, то доступ к эндпойнту разрешён.
    if (!requiredRoles || !requiredRoles.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    //Свойство user в request добавляется только после срабатывания JwtStrategy.
    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    //Если хотя бы одна из требуемых ролей имеется у пользователя, то доступ к эндпойнту разрешён.
    const userHasRequiredRole = requiredRoles.some(
      (requiredRole) => requiredRole === user.role,
    );

    return userHasRequiredRole;
  }
}
