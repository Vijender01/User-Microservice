import * as mongoose from 'mongoose';
import { IUserPurchaseHistory } from 'src/interfaces/user-purchase-history.interface';



export const UserPurchaseHistorySchema = new mongoose.Schema<IUserPurchaseHistory>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
    },
    productId: {
      type: String,
      required: [true, 'Product ID is required'],
    },
    purchaseDate: {
      type: Date,
      default: Date.now, // Automatically set to current date/time
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'], // Ensure at least one product is purchased
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative'],
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  },
);
