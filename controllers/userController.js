/*
 * @Describle:
 * @Author: sunmingyuan <fishmooger@gmail.com>
 * @Date: 2023-12-21 15:00:49
 * @LastEditors: sunmingyuan
 * @LastEditTime: 2023-12-22 10:29:50
 */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 检查邮箱是否已经被注册
    console.log(req.body, "req.body");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // 创建新用户
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // 生成 JWT 令牌
    const token = jwt.sign({ id: savedUser._id }, "your-secret-key", {
      expiresIn: "24h",
    });

    res.status(201).json({ user: savedUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 查找用户
    console.log(req.body, "req.body");
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 验证密码
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 生成 JWT 令牌
    const token = jwt.sign({ id: user._id }, "your-secret-key", {
      expiresIn: "1h",
    });

    res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getUserProfile = async (req, res) => {
  const userId = req.user.id; // 通过身份验证获取当前用户的 ID

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
