const jwt = require('jsonwebtoken');
const Blog = require('../models/Blog');
const { SECRET } = require('../utlis/config');

const initialUsers = [
  {
    _id: '5a422ba71b54a676234d17fb',
    username: 'UncleBob',
    name: 'Robert C. Martin',
    passwordHash: 'testing',
    blogs: [],
  },
  {
    _id: '5a422a851b54a676234d17f7',
    username: 'Dijkstra',
    name: 'Edsger W. Dijkstra',
    passwordHash: 'testing01',
    blogs: [],
  },
  {
    _id: '5a422b891b54a676234d17fa',
    username: 'thisChan',
    name: 'Michael Chan',
    passwordHash: 'testing 03',
    blogs: [],
  },
];

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: '5a422b891b54a676234d17fa',
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: '5a422a851b54a676234d17f7',
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    user: '5a422a851b54a676234d17f7',
    __v: 0,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    user: '5a422ba71b54a676234d17fb',
    __v: 0,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    user: '5a422ba71b54a676234d17fb',
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    user: '5a422ba71b54a676234d17fb',
    __v: 0,
  },
];

const BlogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const newBlogInDB = async () => {
  const blog = new Blog({
    title: 'On the Nature of good testing',
    author: 'Arto Helas',
    url: '/localhost/3003',
    likes: 42,
    user: '5a422ba71b54a676234d17fb',
  });
  await blog.save();
  return blog;
};

const nonExistingId = async () => {
  const blog = new Blog({ title: 'fordelition', url: 'for delition' });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};
// _id: "5a422ba71b54a676234d17fb",
// username: "UncleBob",
const loginUser = ({ _id, username }) => {
  const userToken = { username, id: _id };
  return jwt.sign(userToken, SECRET, { expiresIn: 60 * 60 });
};

module.exports = {
  initialBlogs,
  BlogsInDb,
  nonExistingId,
  newBlogInDB,
  initialUsers,
  loginUser,
};
