import { Injectable } from '@nestjs/common';
import { IUser, IUserWithRole } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserLink } from './interfaces/user-link.schema';
import { Role } from './common/enums/role.enums';
import { IUserRole } from './interfaces/user-role.interface';


@Injectable()
export class AppService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    @InjectModel('UserLink') private readonly userLinkModel: Model<IUserLink>,
    @InjectModel('UserRoles') private readonly userRoleModel: Model<IUserRole>,

  ){}
  getHello(): string {
    return 'Hello World!';
  }

  public async searchUser(params: { email: string }): Promise<IUser[]> {
    return this.userModel.find(params).exec();
  }

  public async searchUserRole(params: { userId: string }):Promise<IUserRole[]>{
    return this.userRoleModel.find(params).exec();
  }

  public async createUser(user: IUser): Promise<IUser> {
    const userModel = new this.userModel(user);
    console.log('userModeluserModeluserModeluserModel',userModel);
    
    return await userModel.save();
  }

  public async addUserRole(userId:string,role: Role): Promise<IUserRole> {
    console.log('sdvjkeajk',userId,'ccsdcsdvsdvsvsv',role);
    console.log('{id: userId, role: role}{id: userId, role: role}{id: userId, role: role}',{id: userId, role: role});
    
    const userRoleModel = new this.userRoleModel({userId: userId, role: role});
    console.log('userRoleModeluserRoleModeluserRoleModeluserRoleModel',userRoleModel);
    
    return await userRoleModel.save();
  }

  public async createUserLink(id: string): Promise<IUserLink> {
    const userLinkModel = new this.userLinkModel({
      user_id: id,
    });
    return await userLinkModel.save();
  }
}
