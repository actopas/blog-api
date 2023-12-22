/*
 * @Describle:
 * @Author: sunmingyuan <fishmooger@gmail.com>
 * @Date: 2023-12-21 13:38:14
 * @LastEditors: sunmingyuan
 * @LastEditTime: 2023-12-22 13:22:08
 */
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const app = express();
const wrapResponse = (req, res, next) => {
  // 保存原始的 res.json 方法
  const originalJson = res.json;

  // 重写 res.json 方法
  res.json = function (data) {
    // console.log(res);
    // 在这里可以对 data 进行包装处理
    const wrappedData = {
      status: res.statusCode, // 添加一个 success 字段表示请求是否成功
      data: data,
    };

    // 调用原始的 res.json 方法发送包装后的数据
    originalJson.call(res, wrappedData);
  };

  next();
};
// 连接 MongoDB 数据库
mongoose.connect("mongodb://localhost:27017/test_data");

// 中间件配置
app.use(express.json());
app.use(cors());
app.use(wrapResponse);
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
