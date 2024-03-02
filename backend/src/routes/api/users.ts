import { User } from "../../models/mongodb/user";
import express from "express";
import bcrypt from "bcryptjs";
import { randomPassword } from "../../utils/authorization";

const router = express.Router();
const user_db = new User();

router.get("/users", async (req, res) => {
  const organizationId = (req as any).organization?.id;
  if (!organizationId) {
    return res.status(404).json({ messaage: "Missing organization id" });
  }
  const users = await user_db.findUsersByOrganizationId(organizationId);
  return res.status(200).json({ users });
});

router.post("/users", async (req, res) => {
  const organizationId = (req as any).organization?.id;
  if (!organizationId) {
    return res.status(404).json({ messaage: "Missing organization id" });
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Required fields not present" });
  }
  const user = await user_db.findUser(email);
  if (user) {
    return res
      .status(400)
      .json({ message: "User with given email already exists" });
  }
  await user_db.createUser(
    email,
    await bcrypt.hash(password, 10),
    organizationId,
  );
  return res.status(201).json({ message: "User created successfully" });
});

router.delete("/users", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Please provide email" });
  }
  if (await user_db.deleteUserByEmail(email)) {
    return res.status(200).json({ message: "User deleted succeessfully" });
  }
  return res.status(400).json({ message: "Someting went wrong" });
});

router.post("/users/reset", async (req, res) => {
  const organizationId = (req as any).organization?.id;
  if (!organizationId) {
    return res.status(404).json({ messaage: "Missing organization id" });
  }
  const user = await user_db.findUser(req.body?.email);
  if (!user) {
    return res.status(404).json({ messaage: "User not found" });
  }
  let pass = randomPassword(8);
  let hashed_password = await bcrypt.hash(pass, 10);
  user.password = hashed_password;
  user.save();
  return res.status(200).json({ password: pass });
});

export default router;
