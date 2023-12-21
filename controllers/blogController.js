/*
 * @Describle:
 * @Author: sunmingyuan <fishmooger@gmail.com>
 * @Date: 2023-12-21 13:39:10
 * @LastEditors: sunmingyuan
 * @LastEditTime: 2023-12-21 18:57:57
 */
// controllers/blogController.js

// 导入博客模型（如果你有定义的话）
const BlogPost = require("../models/blog");
const User = require("../models/user");
// 获取所有博客文章
exports.getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find().populate("author", "username");
    res.json(blogPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 获取单篇博客文章
exports.getBlogPostById = async (req, res) => {
  const postId = req.params.id;

  try {
    const blogPost = await BlogPost.findById(postId).populate(
      "author",
      "username"
    );
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.json(blogPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 创建博客文章
exports.createBlogPost = async (req, res) => {
  const { title, content, tags } = req.body;
  const userId = req.user.id; // 通过身份验证获取当前用户的 ID

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newBlogPost = new BlogPost({
      title,
      content,
      tags,
      author: userId,
    });

    const savedBlogPost = await newBlogPost.save();
    user.posts.push(savedBlogPost._id);
    await user.save();

    res.status(201).json(savedBlogPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 更新博客文章
exports.updateBlogPost = async (req, res) => {
  const postId = req.params.id;
  const { title, content, tags } = req.body;

  try {
    const blogPost = await BlogPost.findByIdAndUpdate(
      postId,
      { title, content, tags, updatedAt: Date.now() },
      { new: true }
    );

    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.json(blogPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 删除博客文章
exports.deleteBlogPost = async (req, res) => {
  const postId = req.params.id;

  try {
    const blogPost = await BlogPost.findByIdAndDelete(postId);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // 删除相关评论
    // await Comment.deleteMany({ _id: { $in: blogPost.comments } });

    // 从作者的博客列表中移除该博客
    const author = await User.findById(blogPost.author);
    if (author) {
      author.posts.pull(blogPost._id);
      await author.save();
    }

    res.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
