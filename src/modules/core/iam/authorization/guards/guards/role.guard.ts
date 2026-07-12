import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUEST_USER_KEY } from '../../../iam.constants';
import { ROLES_KEY } from '../../decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const contextRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // if there are no roles
    if (!contextRoles) {
      return true;
    }

    const user = context.switchToHttp().getRequest()[REQUEST_USER_KEY];
    return contextRoles.some((role) => user.role === role);
  }
}
