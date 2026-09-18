const expenseService = require('../services/expense.service');

const createExpense = async (req, res) => {
  try {
    const expense = await expenseService.create(req.userId, req.body);
    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    // optional filters: ?filter=current_month | last_month | date_range&from=&to=
    const expenses = await expenseService.getAll(req.userId, req.query);
    res.status(200).json({ success: true, data: expenses });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getExpenseById = async (req, res) => {
  try {
    const expense = await expenseService.getById(req.params.id, req.userId);
    res.status(200).json({ success: true, data: expense });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const expense = await expenseService.update(req.params.id, req.userId, req.body);
    res.status(200).json({ success: true, data: expense });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    await expenseService.remove(req.params.id, req.userId);
    res.status(200).json({ success: true, message: 'Expense deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense };
