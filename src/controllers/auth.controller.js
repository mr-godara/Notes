const AuthService = require('../services/auth.service');

const register = async (req, res) => {
  const response = await AuthService.registerUser(req.body);
  res.status(201).json(response);
};

const login = async (req, res) => {
  const response = await AuthService.loginUser(req.body);
  res.status(200).json(response);
};

module.exports = {
  register,
  login
};
