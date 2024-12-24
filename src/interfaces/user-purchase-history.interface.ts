import { Document } from 'mongoose';

export interface IUserPurchaseHistory extends Document {
  userId: string; // ID of the user who made the purchase
  productId: string; // ID of the product purchased
  purchaseDate: Date; // Date and time of the purchase
  quantity: number; // Quantity of the product purchased
  totalPrice: number; // Total price of the purchase
}
`   `