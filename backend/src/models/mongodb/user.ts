import mongoose from "mongoose";

const userSchema = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      password: String,
      email: String,
      organization_id: String,
    },
    {
      timestamps: true,
    },
  ),
);

class User {
  async findUser(email: any) {
    return await userSchema.findOne({ email: email });
  }

  async createUser(email: string, password: string, organization_id: string) {
    const user = new userSchema({
      password: password,
      email: email,
      organization_id: organization_id,
    });
    await user.save();
    return user._id.toString();
  }

  async findUsersByOrganizationId(organizationId: string) {
    const users = await userSchema.find({ organization_id: organizationId });
    return users;
  }

  async deleteUserByEmail(email: string) {
    const user = await userSchema.deleteOne({ email });
    return user.acknowledged;
  }

  async deleteUsers(emails: string[]) {
    const users = await userSchema.deleteMany({ email: emails });
    return users.acknowledged;
  }
}

export { User };
