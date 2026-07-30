import { Document } from 'mongoose';

export interface ISubscription extends Document {
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}
