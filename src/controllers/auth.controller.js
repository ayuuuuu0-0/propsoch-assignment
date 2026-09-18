const authService = require('../services/auth.service');

const register = async (req, res) => {
  try {
    const { email, password, currency } = req.body;
    const user = await authService.register(email, password, currency);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

module.exports = { register, login };
