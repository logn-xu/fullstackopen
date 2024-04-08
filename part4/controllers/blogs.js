const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

blogRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  res.json(blogs);
});

blogRouter.get("/:id", async (req, res) => {
  const blogs = await Blog.findById(req.params.id).populate("user");
  res.json(blogs);
});

blogRouter.post("/", async (req, res) => {
  const body = req.body;
  if (!body.title || !body.url) {
    return res.status(400).end();
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: req.user.id,
  });

  const saveBlog = await blog.save();
  req.user.blogs = req.user.blogs.concat(saveBlog._id);
  await req.user.save();

  res.status(201).json(saveBlog);
});

blogRouter.delete("/:id", async (req, res) => {
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    return res.status(400).end();
  }

  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404).end();
  } else if (blog.user.toString() !== req.user.id) {
    res.status(403).json({ error: "This is not your blog" });
  } else {
    await blog.deleteOne();
    res.status(204).end();
  }
});

blogRouter.put("/:id", async (req, res) => {
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    return res.status(400).end();
  }

  const updateBlog = {
    likes: req.body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateBlog, {
    new: true,
  });
  return res.json(updatedBlog);
});

module.exports = blogRouter;
