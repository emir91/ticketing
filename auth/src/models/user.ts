import { Schema, model } from "mongoose";
import { Password } from "../services/password";
interface UserModel {
  email: string;
  password: string;
}

const userSchema = new Schema<UserModel>(
  {
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    // TODO: this should be handeled on the view level
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
      versionKey: false,
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }

  done();
});

const User = model<UserModel>("User", userSchema);

export { User };
