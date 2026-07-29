import { Schema, model } from 'mongoose';
import { ISubscription } from '../interface/subscription.interface.ts';

const SubscriptionSchema = new Schema<ISubscription>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SubscriptionModel = model<ISubscription>('Subscription', SubscriptionSchema);
