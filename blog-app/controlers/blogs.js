const { SECRET } = require("../utlis/config");
const blogsRouter = require("express").Router();
const Blog = require("../models/Blog");
const User = require("../models/User");
const logger = require("../utlis/logger");
const jwt = require("jsonwebtoken");
const { userExtractor } = require("../utlis/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { blogs: 0 });
  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, SECRET);
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

blogsRouter.delete("/:id", userExtractor, async (request, response, next) => {
  const id = request.params.id;
  try {
    const blog = await Blog.findById(id);
    if (!blog) response.status(404).end();
    if (request.user.toString() === blog.user.toString()) {
      (await blog.deleteOne())
        ? response.status(204).end()
        : response.status(404).end();
    } else {
      const Authorization = new Error("Only allowed to delete your own blogs");
      Authorization.name = "Authorization";
      throw Authorization;
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", userExtractor, async (request, response, next) => {
  const id = request.params.id;
  const body = request.body;
  try {
    const blog = await Blog.findById(id);
    if (blog) response.status(404).end();
    if(blog.user.toString() === request.user.toString()){
      const result = await blog.updateOne({...body},)
    }
    const result = await Blog.findByIdAndUpdate(
      id,
      { ...body },
      
    );
    result ? response.status(200).json(result) : response.status(404).end();
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
