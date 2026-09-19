const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

const register = async (email, password, currency = 'USD') => {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error('Email already in use');

  const hashed = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: { email, password: hashed, currency },
    select: { id: true, email: true, currency: true, createdAt: true },
  });
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });

  // keep the error generic so we don't hint which field is wrong
  if (!user) throw new Error('Invalid credentials');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid credentials');

  const { password: _pw, ...safe } = user;
  return safe;
};

module.exports = { register, login };
