import { Document } from 'mongoose';
import { Role } from 'src/common/enums/role.enums';

export interface IUserRole extends Document {
  userId: string;
  role: Role;
}