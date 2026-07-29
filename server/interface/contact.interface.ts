import { Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}
