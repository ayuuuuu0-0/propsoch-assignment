const userService = require('../services/user.service');

const getProfile = async (req, res) => {
  try {
    const user = await userService.getById(req.userId);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { email, currency } = req.body;
    const user = await userService.update(req.userId, { email, currency });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    await userService.remove(req.userId);
    res.status(200).json({ success: true, message: 'Account deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { getProfile, updateProfile, deleteAccount };
