const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const { SECRET } = require('../utlis/config');
const User = require('../models/User');

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;
  const user = await User.findOne({ username });
  const pwCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);
  if (!(user && pwCorrect)) {
    return response
      .status('401')
      .json({ error: 'invalid username or password' });
  }
  const userToken = { username: user.username, id: user._id };
  const token = jwt.sign(userToken, SECRET, { expiresIn: 60 * 60 });
  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
