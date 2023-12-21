/*
 * @Describle:
 * @Author: sunmingyuan <fishmooger@gmail.com>
 * @Date: 2023-12-21 14:57:10
 * @LastEditors: sunmingyuan
 * @LastEditTime: 2023-12-21 18:56:24
 */
const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth"); // 假设有身份验证中间件

const blogController = require("../controllers/blogController");

// 获取所有博客文章
router.get("/get", blogController.getAllBlogPosts);

// 获取单篇博客文章
router.get("/get/:id", blogController.getBlogPostById);

// 创建博客文章（需要身份验证）
router.post("/create", authenticateUser, blogController.createBlogPost);

// 更新博客文章（需要身份验证）
router.put("/update/:id", authenticateUser, blogController.updateBlogPost);

// 删除博客文章（需要身份验证）
router.delete("/delete/:id", authenticateUser, blogController.deleteBlogPost);

module.exports = router;
