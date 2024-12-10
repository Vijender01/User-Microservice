import { Document } from 'mongoose';
import { Role } from 'src/common/enums/role.enums';

export interface IUser extends Document {
  id?: string;
  email: string;
  password: string;
  is_confirmed: boolean;
  compareEncryptedPassword: (password: string) => boolean;
  getEncryptedPassword: (password: string) => string;
}


// Optionally, define a new interface that includes the role
export interface IUserWithRole extends IUser {
  role: Role; // Include role here temporarily
}