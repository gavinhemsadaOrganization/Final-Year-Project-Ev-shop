import { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcrypt";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  SELLER = "seller",
  FINANCE = "finance",
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  role: UserRole[];
  name: string;
  profile_image?: string;
  date_of_birth?: Date;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: string;
  last_login?: Date;
  comparePassword(raw: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: [String],
      enum: Object.values(UserRole),
      required: true,
      validate: [
        (val: string[]) => val.length > 0 && val.length <= 2, 
        "User must have 1 or 2 roles only",
      ],
      default: [UserRole.USER]
    },
    name: { type: String },
    profile_image: String,
    date_of_birth: Date,
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
    },
    phone: { type: String },
    last_login: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    toObject: {
      transform(_doc, ret: any) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
  }
);

UserSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = function (raw: string) {
  return bcrypt.compare(raw, this.password);
};

export const User = model<IUser>("User", UserSchema);
