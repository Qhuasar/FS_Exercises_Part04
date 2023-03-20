const Blog = require("../models/Blog");
const bcrypt = require("bcrypt");

const initialUsers = [
  {
    username: "UncleBob",
    name: "Robert C. Martin",
    passwordHash: "testing",
    blogs: [],
  },
  {
    username: "Dijkstra",
    name: "Edsger W. Dijkstra",
    passwordHash: "testing01",
    blogs: [],
  },
  {
    username: "thisChan",
    name: "Michael Chan",
    passwordHash: "testing 03",
    blogs: [],
  },
];

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  },
];

const BlogsInDb = async () => {
  const notes = await Blog.find({});
  return notes.map((Blogs) => Blogs.toJSON());
};

const newBlogInDB = async () => {
  const blog = new Blog({
    title: "On the Nature of good testing",
    author: "Arto Helas",
    url: "/localhost/3003",
    likes: 42,
  });
  await blog.save();
  return blog;
};

const nonExistingId = async () => {
  const blog = new Blog({ title: "fordelition", url: "for delition" });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

module.exports = {
  initialBlogs,
  BlogsInDb,
  nonExistingId,
  newBlogInDB,
  initialUsers,
};
