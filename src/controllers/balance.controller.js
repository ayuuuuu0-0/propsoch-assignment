const balanceService = require('../services/balance.service');

const getBalances = async (req, res) => {
  try {
    const balances = await balanceService.calculate(req.userId);
    res.status(200).json({ success: true, data: balances });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { getBalances };
