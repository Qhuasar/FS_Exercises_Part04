const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const logger = require('../utlis/logger');
const { checkPassword } = require('../utlis/password_checker');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs');
  response.status(200).json(users);
});

usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, password, name } = request.body;
    checkPassword(password, next);
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
