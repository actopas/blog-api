/*
 * @Describle:
 * @Author: sunmingyuan <fishmooger@gmail.com>
 * @Date: 2023-12-21 15:06:00
 * @LastEditors: sunmingyuan
 * @LastEditTime: 2023-12-21 15:06:05
 */
const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth"); // 假设有身份验证中间件

const userController = require("../controllers/userController");

// 用户注册
router.post("/register", userController.registerUser);

// 用户登录
router.post("/login", userController.loginUser);

// 获取用户信息（需要身份验证）
router.get("/profile", authenticateUser, userController.getUserProfile);

module.exports = router;
