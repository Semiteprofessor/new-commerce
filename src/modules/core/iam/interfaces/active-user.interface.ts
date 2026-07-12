import { UserRole } from '../../../common/enums/role.enum';

export interface ActiveUserData {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
}
