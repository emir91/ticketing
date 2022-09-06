import { Schema, model } from "mongoose";

interface UserModel {
  email: string;
  password: string;
}

const userSchema = new Schema<UserModel>({
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});

const User = model<UserModel>("User", userSchema);

export { User };
