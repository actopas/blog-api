/*
 * @Describle:
 * @Author: sunmingyuan <fishmooger@gmail.com>
 * @Date: 2023-12-21 15:06:27
 * @LastEditors: sunmingyuan
 * @LastEditTime: 2023-12-21 17:52:59
 */
const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  // 从请求头中获取 Authorization 标头
  const token = req.header("Authorization");

  // 检查是否提供了令牌
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // 验证令牌
    const decoded = jwt.verify(token, "your-secret-key");

    // 将用户 ID 添加到请求对象中，以便后续路由可以访问
    req.user = { id: decoded.id };
    console.log(req.user, "req.user");
    // 继续执行下一个中间件或路由处理程序
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { authenticateUser };
