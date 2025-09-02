import { Schema, model, Document, Types } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  SELLER = 'seller',
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  profile_image?: string;
  date_of_birth?: Date;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  last_login?: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), required: true },
  name: { type: String, required: true },
  profile_image: String,
  date_of_birth: Date,
  address: String,
  city: String,
  province: String,
  postal_code: String,
  last_login: Date,
}, { timestamps: true });

export default model<IUser>('User', UserSchema);