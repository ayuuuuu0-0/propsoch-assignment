const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

const register = async (email, password, currency = 'USD') => {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error('Email already in use');

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, currency },
    select: { id: true, email: true, currency: true, createdAt: true },
  });
  return user;
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid credentials');

  // return user without password
  const { password: _, ...safeUser } = user;
  return safeUser;
};

module.exports = { register, login };
