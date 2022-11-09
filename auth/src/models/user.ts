import { Document, Model, model, Schema } from "mongoose";
import { Password } from "../services/password";

interface UserAttrs {
  email: string;
  password: string;
}

// an interface that
// describes the properties
// that User Model has
interface UserDoc extends Document {
  email: string;
  password: string;
}

// an interface that's going to tell TS
// that there's going to be a build function
// available on User model
interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new Schema(
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

// method to ensure that TS get involved
// in the process of making sure we are passing
// the correct set of attributes
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};
const User = model<UserDoc, UserModel>("User", userSchema);

export { User };
