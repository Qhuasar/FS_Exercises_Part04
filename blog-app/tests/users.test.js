const supertest = require('supertest');
const { initialUsers } = require('./tests_helpers');
const User = require('../models/User');
const { app } = require('../app');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  for (const user of initialUsers) {
    const newUser = new User(user);
    await newUser.save();
  }
});

describe('post users', () => {
  test('invalid password returns correct code', async () => {
    const newUser = {
      username: 'Quazar',
      password: 'hel',
      name: 'pedro',
    };
    const response = await api.post('/api/users').send(newUser).expect(400);
    expect(response.body.error).toBe(
      'Password must be atleast 3 characters long',
    );
  });

  test('usernames must be unique', async () => {
    const newUser = {
      username: 'UncleBob',
      name: 'Robert C. Martin',
      password: 'cleanCode',
    };
    await api.post('/api/users').send(newUser).expect(400);
  });

  test('must have a  username', async () => {
    const newUser = {
      name: 'Robert C. Martin',
      password: 'cleanCode',
    };
    await api.post('/api/users').send(newUser).expect(400);
  });

  test('must have a password', async () => {
    const newUser = {
      username: 'john',
      name: 'Robert C. Martin',
    };
    const response = await api.post('/api/users').send(newUser).expect(400);
    expect(response.body.error).toBe('Missing password');
  });
});
