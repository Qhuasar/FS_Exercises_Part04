const blogsRouter = require("express").Router();
const Blog = require("../models/Blog");

blogsRouter.get("/api/blogs", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/api/blogs", async (request, response) => {
  const blog = new Blog(request.body);
  console.log(blog);
  const result = await blog.save();
  response.status(201).json(result);
});

module.exports = blogsRouter;
