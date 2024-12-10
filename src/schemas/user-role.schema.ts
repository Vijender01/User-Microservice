import mongoose, { Schema, Document } from 'mongoose';
import { Role } from 'src/common/enums/role.enums';
import { IUserRole } from 'src/interfaces/user-role.interface';


export const UserRoleSchema = new Schema<IUserRole>({
  userId: { type: String, required: true, unique: true },
  role: { type: String, enum: Object.values(Role), required: true },
}, {
  timestamps: true, // Optional: Adds createdAt and updatedAt fields
});

// export const UserRole = mongoose.model<IUserRole>('UserRole', UserRoleSchema);
