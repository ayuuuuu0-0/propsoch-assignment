const prisma = require('../config/prisma');

const getById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, currency: true, createdAt: true },
  });
  if (!user) throw new Error('User not found');
  return user;
};

const update = async (id, data) => {
  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, currency: true, updatedAt: true },
  });
  return user;
};

const remove = async (id) => {
  await prisma.user.delete({ where: { id } });
};

module.exports = { getById, update, remove };
