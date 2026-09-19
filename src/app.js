const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/users', require('./routes/user.routes'));
app.use('/api/v1/expenses', require('./routes/expense.routes'));
app.use('/api/v1/balances', require('./routes/balance.routes'));

app.get('/', (req, res) => res.json({ message: 'Splitwise API running' }));

module.exports = app;
