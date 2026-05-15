const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const UserModel = require('../models/user.model');
const { AppError } = require('../utils/AppError');

const registerUser = async ({ email, password }) => {
  const existingUser = await UserModel.findUserByEmail(email);

  if (existingUser) {
    throw new AppError(409, 'Email already exists');
  }

  const passwordHash = await bcrypt.hash(password, env.bcryptSaltRounds);
  await UserModel.createUser({ email, passwordHash });

  return { message: 'User registered successfully' };
};

const loginUser = async ({ email, password }) => {
  const user = await UserModel.findUserByEmail(email);

  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw new AppError(401, 'Invalid email or password');
  }

  const accessToken = jwt.sign(
    { userId: user.id },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  return { access_token: accessToken };
};

module.exports = {
  registerUser,
  loginUser
};
