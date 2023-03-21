const mongoose = require('mongoose');
const supertest = require('supertest');
const Blog = require('../models/Blog');
const User = require('../models/User');
const { app } = require('../app');
const {
  initialBlogs,
  BlogsInDb,
  nonExistingId,
  newBlogInDB,
  initialUsers,
  loginUser,
} = require('./tests_helpers');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  for (const user of initialUsers) {
    const newUser = new User(user);
    await newUser.save();
  }

  for (const blog of initialBlogs) {
    const newBlogObj = new Blog(blog);
    await newBlogObj.save();
  }
});

describe('get requests', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  }, 100000);

  test('correct number of items', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body.length).toBe(initialBlogs.length);
  });

  test('correct properity name', async () => {
    const response = await api.get('/api/blogs');
    for (const blog of response.body) {
      expect(blog.id).toBeDefined();
    }
  });
});

describe('post requests', () => {
  const testUser = { _id: '5a422ba71b54a676234d17fb', username: 'UncleBob' };
  const token = loginUser(testUser);
  test('adds valid blog', async () => {
    const newBlog = {
      title: 'On the Nature of good testing',
      author: 'Arto Helas',
      url: '/localhost/3003',
      likes: 42,
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const getRes = await api.get('/api/blogs');
    // const authors = getRes.body.map((blog) => blog.author);
    const authors = getRes.body.map(({ id, user, ...blog }) => blog);
    expect(authors).toContainEqual(newBlog);
  });

  test('size of collection is updated', async () => {
    const newBlog = {
      title: 'On the Nature of good testing',
      author: 'Arto Helas',
      url: '/localhost/3003',
      likes: 42,
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const response = await api.get('/api/blogs');
    expect(response.body.length).toEqual(initialBlogs.length + 1);
  });

  test('likes property missing defaults to 0', async () => {
    const newBlog = {
      title: 'On the Nature of good testing',
      author: 'Arto Helas',
      url: '/localhost/3003',
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const response = await api.get('/api/blogs');
    const find_blog = response.body.find(
      (blog) => blog.title === 'On the Nature of good testing',
    );
    expect(find_blog.likes).toBe(0);
  });

  test('title property missing responds with 400', async () => {
    const newBlog = {
      author: 'Arto Helas',
      url: '/localhost/3003',
      likes: 42,
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });

  test('url property missing responds with 400', async () => {
    const newBlog = {
      title: 'On the Nature of good testing',
      author: 'Arto Helas',
      likes: 42,
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });
});
describe('blog deletion functionality', () => {
  const testUser = { _id: '5a422b891b54a676234d17fa', username: 'thisChan' };
  const token = loginUser(testUser);

  test('deletes one blog', async () => {
    const blogsToBeDeleted = await BlogsInDb();
    await api
      .delete(`/api/blogs/${blogsToBeDeleted[0].id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204);
    const blogsMinusOne = await BlogsInDb();
    expect(blogsMinusOne.length).toBe(initialBlogs.length - 1);
  });

  test('handles malformed id type', async () => {
    await api.delete('/api/blogs/abc123').expect(400);
  });

  test('handles correct non-existing id type', async () => {
    const fakeId = await nonExistingId();
    await api
      .delete(`/api/blogs/${fakeId}`)
      .set('Authorization', `bearer ${token}`)
      .expect(404);
  });
});

describe('update one blog', () => {
  const updatedBlog = {
    title: 'On the Nature of good testing and Clean Code',
    author: 'Arto Hellas',
    url: '/localhost/3001',
    likes: 33,
  };

  const testUser = { _id: '5a422ba71b54a676234d17fb', username: 'UncleBob' };
  const token = loginUser(testUser);

  test('update one blog correctly', async () => {
    const testBlog = await newBlogInDB();
    await api
      .put(`/api/blogs/${testBlog.id}`)
      .set('Authorization', `bearer ${token}`)
      .send(updatedBlog)
      .expect(200);
    const currentDB = await BlogsInDb();
    expect(currentDB.map(({ id, user, ...blog }) => blog)).toContainEqual(
      updatedBlog,
    );
  });

  test('returns correct blog object', async () => {
    const testBlog = await newBlogInDB();
    const updResponse = await api
      .put(`/api/blogs/${testBlog.id}`)
      .set('Authorization', `bearer ${token}`)
      .send(updatedBlog)
      .expect(200);
    const currentDB = await BlogsInDb();
    expect(currentDB).toContainEqual(updResponse.body);
  });

  test('updates likes correclty', async () => {
    const testBlog = await newBlogInDB();
    const updResponse = await api
      .put(`/api/blogs/${testBlog.id}`)
      .send(updatedBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(200);
    expect(updResponse.body.likes).toBe(updatedBlog.likes);
  });

  test('handles malformed id type', async () => {
    await api.put('/api/blogs/abc123').expect(400);
  });

  test('handles correct non-existing id type', async () => {
    const fakeId = await nonExistingId();
    await api
      .put(`/api/blogs/${fakeId}`)
      .set('Authorization', `bearer ${token}`)
      .expect(404);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
