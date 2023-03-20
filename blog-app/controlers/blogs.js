const { SECRET } = require("../utlis/config");
const blogsRouter = require("express").Router();
const Blog = require("../models/Blog");
const User = require("../models/User");
const logger = require("../utlis/logger");
const jwt = require("jsonwebtoken");
const { getTokenFrom } = require("../utlis/get_from_token");

blogsRouter.get("/api/blogs", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { blogs: 0 });
  response.json(blogs);
});

blogsRouter.post("/api/blogs", async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }
    const user = await User.findById(decodedToken.id);
    const blog = new Blog({ ...request.body, user: user._id });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/api/blogs/:id", async (request, response, next) => {
  const id = request.params.id;
  try {
    (await Blog.findByIdAndDelete(id))
      ? response.status(204).end()
      : response.status(404).end();
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/api/blogs/:id", async (request, response, next) => {
  const id = request.params.id;
  const body = request.body;
  try {
    const result = await Blog.findByIdAndUpdate(
      id,
      { ...body },
      { runValidators: true, new: true }
    );
    result ? response.status(200).json(result) : response.status(404).end();
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
