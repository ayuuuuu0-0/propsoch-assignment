const prisma = require('../config/prisma');

const create = async (userId, body) => {
  const { name, value, currency, date, members } = body;

  return await prisma.expense.create({
    data: {
      name,
      value,
      currency,
      date: new Date(date),
      createdById: userId,
      members: {
        create: members.map((m) => ({ userId: m.userId, share: m.share })),
      },
    },
    include: {
      members: { include: { user: { select: { id: true, email: true } } } },
    },
  });
};

const buildDateFilter = (query) => {
  const now = new Date();
  if (query.filter === 'current_month')
    return { gte: new Date(now.getFullYear(), now.getMonth(), 1), lte: new Date(now.getFullYear(), now.getMonth() + 1, 0) };
  if (query.filter === 'last_month')
    return { gte: new Date(now.getFullYear(), now.getMonth() - 1, 1), lte: new Date(now.getFullYear(), now.getMonth(), 0) };
  if (query.filter === 'date_range' && query.from && query.to)
    return { gte: new Date(query.from), lte: new Date(query.to) };
  return undefined;
};

const getAll = async (userId, query) => {
  const dateFilter = buildDateFilter(query);

  return await prisma.expense.findMany({
    where: {
      OR: [{ createdById: userId }, { members: { some: { userId } } }],
      ...(dateFilter && { date: dateFilter }),
    },
    include: {
      createdBy: { select: { id: true, email: true } },
      members: { include: { user: { select: { id: true, email: true } } } },
    },
    orderBy: { date: 'desc' },
  });
};

const getById = async (id, userId) => {
  const expense = await prisma.expense.findFirst({
    where: { id, OR: [{ createdById: userId }, { members: { some: { userId } } }] },
    include: {
      createdBy: { select: { id: true, email: true } },
      members: { include: { user: { select: { id: true, email: true } } } },
    },
  });
  if (!expense) throw new Error('Expense not found');
  return expense;
};

const update = async (id, userId, body) => {
  const expense = await prisma.expense.findFirst({ where: { id, createdById: userId } });
  if (!expense) throw new Error('Not found or you are not the creator');

  const { name, value, currency, date, members } = body;

  return await prisma.expense.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(value && { value }),
      ...(currency && { currency }),
      ...(date && { date: new Date(date) }),
      ...(members && {
        members: {
          deleteMany: {}, // wipe old, re-insert
          create: members.map((m) => ({ userId: m.userId, share: m.share })),
        },
      }),
    },
    include: {
      members: { include: { user: { select: { id: true, email: true } } } },
    },
  });
};

const remove = async (id, userId) => {
  const expense = await prisma.expense.findFirst({ where: { id, createdById: userId } });
  if (!expense) throw new Error('Not found or you are not the creator');
  await prisma.expense.delete({ where: { id } });
};

module.exports = { create, getAll, getById, update, remove };
