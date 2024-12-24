import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { IUserSearchResponse } from './interfaces/user-search-response.interface';
import { IUser, IUserWithRole } from './interfaces/user.interface';
import { IUserCreateResponse } from './interfaces/user-create-response.interface';
import { Role } from './common/enums/role.enums';
import { IUserPurchaseHistory } from './interfaces/user-purchase-history.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('test')
  public testHandler() {
    console.log('Test message received');
  }

  @MessagePattern('user_search_by_credentials')
  public async searchUserByCredentials(searchParams: {
    email: string;
    password: string;
  }): Promise<IUserSearchResponse> {
    let result: IUserSearchResponse;
    console.log('search params???????????', searchParams);

    if (searchParams.email && searchParams.password) {
      const user = await this.appService.searchUser({
        email: searchParams.email,
      });

      console.log('user????????', user);


      const role = await this.appService.searchUserRole({
        userId: user[0].id,
      })

      const userData =
      {
        ...user[0].toObject(),
        role: role[0].role
      }

      console.log('userData', userData);


      if (user && user[0]) {
        if (await user[0].compareEncryptedPassword(searchParams.password)) {
          result = {
            status: HttpStatus.OK,
            message: 'user_search_by_credentials_success',
            user: userData,
          };
        } else {
          result = {
            status: HttpStatus.NOT_FOUND,
            message: 'user_search_by_credentials_not_match',
            user: null,
          };
        }
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'user_search_by_credentials_not_found',
          user: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.NOT_FOUND,
        message: 'user_search_by_credentials_not_found',
        user: null,
      };
    }

    return result;
  }


  @MessagePattern('user_get_by_id')
  public async getUserById(id: string): Promise<IUserSearchResponse> {
    let result: IUserSearchResponse;

    // if (id) {
    //   const user = await this.userService.searchUserById(id);
    //   if (user) {
    //     result = {
    //       status: HttpStatus.OK,
    //       message: 'user_get_by_id_success',
    //       user,
    //     };
    //   } else {
    //     result = {
    //       status: HttpStatus.NOT_FOUND,
    //       message: 'user_get_by_id_not_found',
    //       user: null,
    //     };
    //   }
    // } else {
    //   result = {
    //     status: HttpStatus.BAD_REQUEST,
    //     message: 'user_get_by_id_bad_request',
    //     user: null,
    //   };
    // }


    return result;
  }


  @MessagePattern('user_create')
  public async createUser(userParams: IUserWithRole): Promise<IUserCreateResponse> {
    let result: IUserCreateResponse;
    console.log('these are create user params', userParams);


    if (userParams) {
      const usersWithEmail = await this.appService.searchUser({
        email: userParams.email,
      });

      if (usersWithEmail && usersWithEmail.length > 0) {
        result = {
          status: HttpStatus.CONFLICT,
          message: 'user_create_conflict',
          user: null,
          errors: {
            email: {
              message: 'Email already exists',
              path: 'email',
            },
          },
        };
      } else {
        try {
          userParams.is_confirmed = false;
          const createdUser = await this.appService.createUser(userParams);
          console.log('createdUser???', createdUser);

          const userRole = await this.appService.addUserRole(createdUser.id, userParams.role);

          console.log('UserRoleUserRoleUserRole', userRole);

          const createdUserWithRole = {
            ...createdUser.toObject(), // Convert the Mongoose document to a plain object if needed
            role: userRole.role, // Add the role from userRole
          };

          console.log('createdUserWithRolecreatedUserWithRolecreatedUserWithRolecreatedUserWithRolecreatedUserWithRolecreatedUserWithRolecreatedUserWithRolecreatedUserWithRolecreatedUserWithRole', createdUserWithRole);


          const userLink = await this.appService.createUserLink(
            createdUser.id,
          );
          delete createdUser.password;
          result = {
            status: HttpStatus.CREATED,
            message: 'user_create_success',
            user: createdUserWithRole,
            errors: null,
          };

        } catch (e) {
          result = {
            status: HttpStatus.PRECONDITION_FAILED,
            message: 'user_create_precondition_failed',
            user: null,
            errors: e.errors,
          };
        }
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'user_create_bad_request',
        user: null,
        errors: null,
      };
    }

    console.log('resultt?????', result);


    return result;
  }

  @EventPattern('purchase_history')
  public async handlePurchaseHistoryEvent(data: { purchase: IUserPurchaseHistory }) {
    const { purchase } = data;

    // Save the purchase history in the database
    await this.appService.updatePurchaseHistory(purchase);
  }
}
