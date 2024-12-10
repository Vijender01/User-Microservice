import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from './services/config/config.service';
import { MongoConfigService } from './services/config/mongo-config.service';
import { UserSchema } from './schemas/user.schema';
import { UserLinkSchema } from './schemas/user-link.schema';
import { UserRoleSchema } from './schemas/user-role.schema';


@Module({
  imports: [
    // MongooseModule.forRootAsync({
    //   useClass: MongoConfigService,
    // }),
    MongooseModule.forRoot('mongodb://localhost:27017/nest_main',{
      autoCreate: true
    }),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
        collection: 'users',
      },
      {
        name: 'UserLink',
        schema: UserLinkSchema,
        collection: 'user_links',
      },
      {
        name: "UserRoles",
        schema: UserRoleSchema,
        collection: 'user_roles'
      }
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
