const mongoose = require("mongoose");
const Blog = require("../models/Blog");
const supertest = require("supertest");
const { app } = require("../app");
const { initialBlogs } = require("./tests_helpers");
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  for (let blog of initialBlogs) {
    const newBlogObj = new Blog(blog);
    await newBlogObj.save();
  }
});

describe("get requests", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 100000);

  test("correct number of items", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body.length).toBe(initialBlogs.length);
  });

  test("correct properity name", async () => {
    const response = await api.get("/api/blogs");
    for (const blog of response.body) {
      expect(blog.id).toBeDefined();
    }
  });
});

describe("post requests", () => {
  test("adds valid blog", async () => {
    const newBlog = {
      title: "On the Nature of good testing",
      author: "Arto Helas",
      url: "/localhost/3003",
      likes: 42,
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const getRes = await api.get("/api/blogs");
    //const authors = getRes.body.map((blog) => blog.author);
    const authors = getRes.body.map(({ id, ...blog }) => blog);
    debugger;
    expect(authors).toContainEqual(newBlog);
  });

  test("size of collection is updated", async () => {
    const newBlog = {
      title: "On the Nature of good testing",
      author: "Arto Helas",
      url: "/localhost/3003",
      likes: 42,
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const response = await api.get("/api/blogs");
    expect(response.body.length).toEqual(initialBlogs.length + 1);
  });

  test("likes property missing", async () => {
    const newBlog = {
      title: "On the Nature of good testing",
      author: "Arto Helas",
      url: "/localhost/3003",
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const response = await api.get("/api/blogs");
    //TODO
    const find_blog = response.body.
  });
  

});

afterAll(async () => {
  await mongoose.connection.close();
});
