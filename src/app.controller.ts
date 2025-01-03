import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { IUserSearchResponse } from './interfaces/user-search-response.interface';
import { IUser, IUserWithRole } from './interfaces/user.interface';
import { IUserCreateResponse } from './interfaces/user-create-response.interface';
import { IUserPurchaseHistory } from './interfaces/user-purchase-history.interface';
import { RESPONSE_MESSAGES } from './common/constants/response-messages';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // Endpoint to return a simple "Hello World" message
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Handles user search by credentials (email and password)
  @MessagePattern('user_search_by_credentials')
  public async searchUserByCredentials(searchParams: {
    email: string;
    password: string;
  }): Promise<IUserSearchResponse> {
    let result: IUserSearchResponse;

    try {
      // Check if email and password are provided
      if (searchParams.email && searchParams.password) {
        // Search for the user by email
        const user = await this.appService.searchUser({
          email: searchParams.email,
        });

        // Retrieve the user's role
        const role = await this.appService.searchUserRole({
          userId: user[0]?.id,
        });

        // Construct user data with role
        const userData = {
          ...user[0]?.toObject(),
          role: role[0]?.role,
        };

        // Verify the password and construct the response
        if (user && user[0] && await user[0].compareEncryptedPassword(searchParams.password)) {
          result = {
            status: HttpStatus.OK,
            message: RESPONSE_MESSAGES.SEARCH_USER_BY_CREDENTIALS_SUCCESS,
            user: userData,
          };
        } else {
          result = {
            status: HttpStatus.NOT_FOUND,
            message: RESPONSE_MESSAGES.SEARCH_USER_BY_CREDENTIALS_NO_MATCH,
            user: null,
          };
        }
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: RESPONSE_MESSAGES.SEARCH_USER_BY_CREDENTIALS_NOT_FOUND,
          user: null,
        };
      }
    } catch (error) {
      console.error('Error in searchUserByCredentials:', error);
      result = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while searching for the user.',
        user: null,
      };
    }

    return result;
  }

  // Handles user creation and assigns a role
  @MessagePattern('user_create')
  public async createUser(userParams: IUserWithRole): Promise<IUserCreateResponse> {
    let result: IUserCreateResponse;

    try {
      console.log('User creation parameters:', userParams);

      if (userParams) {
        // Check if the email is already in use
        const usersWithEmail = await this.appService.searchUser({
          email: userParams.email,
        });

        if (usersWithEmail && usersWithEmail.length > 0) {
          result = {
            status: HttpStatus.CONFLICT,
            message: 'User creation conflict',
            user: null,
            errors: {
              email: {
                message: RESPONSE_MESSAGES.EMAIL_ALREADY_EXISTs,
                path: 'email',
              },
            },
          };
        } else {
          // Create the user and assign a role
          userParams.is_confirmed = false;
          const createdUser = await this.appService.createUser(userParams);
          const userRole = await this.appService.addUserRole(createdUser.id, userParams.role);

          const createdUserWithRole = {
            ...createdUser.toObject(),
            role: userRole.role,
          };

          await this.appService.createUserLink(createdUser.id);

          delete createdUser.password; // Remove sensitive information from the response

          result = {
            status: HttpStatus.CREATED,
            message: RESPONSE_MESSAGES.USER_CREATE_SUCCESS,
            user: createdUserWithRole,
            errors: null,
          };
        }
      } else {
        result = {
          status: HttpStatus.BAD_REQUEST,
          message: RESPONSE_MESSAGES.USER_CREATE_BAD_REQUEST,
          user: null,
          errors: null,
        };
      }
    } catch (error) {
      console.error('Error in createUser:', error);
      result = {
        status: HttpStatus.PRECONDITION_FAILED,
        message: RESPONSE_MESSAGES.USER_CREATE_PRECONDITION_FAILED,
        user: null,
        errors: error.errors,
      };
    }

    console.log('User creation result:', result);
    return result;
  }

  // Handles events related to user purchase history
  @EventPattern('purchase_history')
  public async handlePurchaseHistoryEvent(data: { purchase: IUserPurchaseHistory }) {
    try {
      const { purchase } = data;

      // Save the purchase history in the database
      await this.appService.updatePurchaseHistory(purchase);

      console.log('Purchase history saved successfully.');
    } catch (error) {
      console.error('Error in handlePurchaseHistoryEvent:', error);
    }
  }
}
