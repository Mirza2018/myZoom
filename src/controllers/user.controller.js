import { User } from "../models/user.modal.js";
import httpStatus from "http-status";
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(404).json({ message: "Email and password required" });
    }
    const userInfo = await User.findOne({ username });
    if (!userInfo) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User not Found" });
    }

    const isMatch = await bcrypt.compare(password, userInfo.password);
    if (!isMatch) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Invalid password",
      });
    }
    if (isMatch) {
      let token = crypto.randomBytes(20).toString("hex");
      userInfo.token = token;

      await userInfo.save();
      return res.status(httpStatus.OK).json({ token: token });
    }
  } catch (error) {
    return res.status(500).json({ message: `Something went worng ${error}` });
  }
};

const register = async (req, res) => {
  const { name, username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(httpStatus.FOUND)
        .json({ message: "User alreasy exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      username: username,
      password: hashedPassword,
    });
    newUser.save();
    res.status(httpStatus.CREATED).json({ message: "User Registered" });
  } catch (error) {
    res.status(500).json(`Something went worng ${error}`);
  }
};

export { login, register };
