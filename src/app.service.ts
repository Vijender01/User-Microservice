import { Injectable } from '@nestjs/common';
import { IUser, IUserWithRole } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserLink } from './interfaces/user-link.interface';
import { Role } from './common/enums/role.enums';
import { IUserRole } from './interfaces/user-role.interface';
import { IUserPurchaseHistory } from './interfaces/user-purchase-history.interface';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    @InjectModel('UserLink') private readonly userLinkModel: Model<IUserLink>,
    @InjectModel('UserRoles') private readonly userRoleModel: Model<IUserRole>,
    @InjectModel('UserPurchaseHistory') private readonly userPurchaseHistoryModel: Model<IUserPurchaseHistory>,
  ) {}

  // Default endpoint returning a simple message
  getHello(): string {
    return 'Hello World!';
  }

  // Method to search for a user based on parameters (e.g., email)
  public async searchUser(params: { email: string }): Promise<IUser[]> {
    try {
      return await this.userModel.find(params).exec();
    } catch (error) {
      console.error('Error searching for user:', error);
      throw new Error('An unexpected error occurred while searching for the user.');
    }
  }

  // Method to search for roles assigned to a user
  public async searchUserRole(params: { userId: string }): Promise<IUserRole[]> {
    try {
      return await this.userRoleModel.find(params).exec();
    } catch (error) {
      console.error('Error searching for user roles:', error);
      throw new Error('An unexpected error occurred while searching for user roles.');
    }
  }

  // Method to create a new user
  public async createUser(user: IUser): Promise<IUser> {
    try {
      const userModel = new this.userModel(user);
      return await userModel.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('An unexpected error occurred while creating the user.');
    }
  }

  // Method to assign a role to a user
  public async addUserRole(userId: string, role: Role): Promise<IUserRole> {
    try {
      const userRoleModel = new this.userRoleModel({ userId: userId, role: role });
      return await userRoleModel.save();
    } catch (error) {
      console.error('Error adding user role:', error);
      throw new Error('An unexpected error occurred while adding the user role.');
    }
  }

  // Method to create a link for a user
  public async createUserLink(id: string): Promise<IUserLink> {
    try {
      const userLinkModel = new this.userLinkModel({
        user_id: id,
      });
      return await userLinkModel.save();
    } catch (error) {
      console.error('Error creating user link:', error);
      throw new Error('An unexpected error occurred while creating the user link.');
    }
  }

  // Method to update a user's purchase history
  public async updatePurchaseHistory(purchase: IUserPurchaseHistory): Promise<IUserPurchaseHistory> {
    try {
      const newPurchase = new this.userPurchaseHistoryModel(purchase);

      // Save the purchase data into the database
      return await newPurchase.save();
    } catch (error) {
      console.error('Error updating purchase history:', error);
      throw new Error('An unexpected error occurred while updating the purchase history.');
    }
  }
}
