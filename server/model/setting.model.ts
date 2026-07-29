import { Schema, model } from 'mongoose';
import { ISetting } from '../interface/setting.interface.ts';

const SettingSchema = new Schema<ISetting>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SettingModel = model<ISetting>('Setting', SettingSchema);
