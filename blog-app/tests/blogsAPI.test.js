const mongoose = require("mongoose");
const Blog = require("../models/Blog");
const supertest = require("supertest");
const { app } = require("../app");
const { initialBlogs, BlogsInDb, nonExistingId } = require("./tests_helpers");
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

  test("likes property missing defaults to 0", async () => {
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
    const find_blog = response.body.find(
      (blog) => blog.title === "On the Nature of good testing"
    );
    expect(find_blog.likes).toBe(0);
  });

  test("title property missing responds with 400", async () => {
    const newBlog = {
      author: "Arto Helas",
      url: "/localhost/3003",
      likes: 42,
    };
    await api.post("/api/blogs").send(newBlog).expect(400);
  });

  test("url property missing responds with 400", async () => {
    const newBlog = {
      title: "On the Nature of good testing",
      author: "Arto Helas",
      likes: 42,
    };
    await api.post("/api/blogs").send(newBlog).expect(400);
  });
});
describe("delete one note", () => {
  test("deletes one note", async () => {
    const blogsToBeDeleted = await BlogsInDb();
    await api.delete(`/api/blogs/${blogsToBeDeleted[0].id}`).expect(204);
    const blogsMinusOne = await BlogsInDb();
    expect(blogsMinusOne.length).toBe(initialBlogs.length - 1);
  });

  test("handles malformed id type", async () => {
    await api.delete(`/api/blogs/abc123`).expect(400);
  });

  test("handles correct non-existing id type", async () => {
    const fakeId = await nonExistingId();
    await api.delete(`/api/blogs/${fakeId}`).expect(404);
  });
});

describe("update one note", () => {
  
})

afterAll(async () => {
  await mongoose.connection.close();
});
