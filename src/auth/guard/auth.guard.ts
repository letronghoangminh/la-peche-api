import { AuthGuard } from '@nestjs/passport';

export class UserGuard extends AuthGuard('user') {
  constructor() {
    super();
  }
}

export class AdminGuard extends AuthGuard('admin') {
  constructor() {
    super();
  }
}
