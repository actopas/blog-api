/*
 * @Describle:
 * @Author: sunmingyuan <fishmooger@gmail.com>
 * @Date: 2023-12-21 13:38:14
 * @LastEditors: sunmingyuan
 * @LastEditTime: 2023-12-21 16:21:33
 */
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const app = express();

// 连接 MongoDB 数据库
mongoose.connect("mongodb://localhost:27017/test_data");

// 中间件配置
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
const db = mongoose.connection;

// 引入用户路由模块
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
// 使用用户路由
app.use("/api/user", userRoutes);
app.use("/api/blog", blogRoutes);

// 路由
// 在这里添加你的路由，处理不同的请求
// 服务器启动
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// 使用任务路由
