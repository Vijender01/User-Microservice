import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { IUserSearchResponse } from './interfaces/user-search-response.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
    console.log('search params???????????',searchParams);
    
    if (searchParams.email && searchParams.password) {
      const user = await this.appService.searchUser({
        email: searchParams.email,
      });

      if (user && user[0]) {
        if (await user[0].compareEncryptedPassword(searchParams.password)) {
          result = {
            status: HttpStatus.OK,
            message: 'user_search_by_credentials_success',
            user: user[0],
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

    console.log('resultttt?????',result);
    
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
}
