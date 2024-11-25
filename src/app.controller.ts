import { Controller, Get } from '@nestjs/common';
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
