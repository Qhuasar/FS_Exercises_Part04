const blogsRouter = require("express").Router();
const Blog = require("../models/Blog");
const logger = require("../utlis/logger");

blogsRouter.get("/api/blogs", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/api/blogs", async (request, response, next) => {
  try {
    const blog = new Blog(request.body);
    const result = await blog.save();
    response.status(201).json(result);
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
