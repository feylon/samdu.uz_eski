import { Role } from '../enums/role.enum';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}
