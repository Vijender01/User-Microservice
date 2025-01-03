import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from './services/config/config.service';
import { UserSchema } from './schemas/user.schema';
import { UserLinkSchema } from './schemas/user-link.schema';
import { UserRoleSchema } from './schemas/user-role.schema';
import { UserPurchaseHistorySchema } from './schemas/user-purchase-history.schema';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    // ConfigModule loads environment variables and configuration settings
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Load environment variables from the .env file
    }),

    // MongooseModule sets up MongoDB connection and schema registration
    MongooseModule.forRoot(process.env.MONGODB_URL, {
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
      },
      {
        name: "UserPurchaseHistory",
        schema: UserPurchaseHistorySchema,
        collection: 'user_purchase_history'
      }
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule { }
