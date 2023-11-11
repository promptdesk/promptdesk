import mongoose from "mongoose";

const userScheama = mongoose.model(
  'User',
  new mongoose.Schema({
    password: String,
    email: String,
    organization_id: String,
  }, {
    timestamps: true
  })
);

class User {

  async findUser(email:any) {
    const user = await userScheama.findOne({ email:email });
    return user;
  }

  async createUser(email:string, password:string, organization_id:string) {
    
    const user = new userScheama({
        password: password,
        email: email,
        organization_id: organization_id,
    });
    await user.save();
    return user._id.toString();

  }

}

export { User }