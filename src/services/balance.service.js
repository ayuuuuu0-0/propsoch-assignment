const prisma = require('../config/prisma');

// builds a net balance map across all expenses the user is part of
// positive amount means they owe me, negative means i owe them
const calculate = async (userId) => {
  const expenses = await prisma.expense.findMany({
    where: {
      OR: [{ createdById: userId }, { members: { some: { userId } } }],
    },
    include: {
      members: { include: { user: { select: { id: true, email: true } } } },
      createdBy: { select: { id: true, email: true } },
    },
  });

  const map = {};

  for (const expense of expenses) {
    if (expense.createdById === userId) {
      // i paid so each member owes me their share
      for (const member of expense.members) {
        if (member.userId === userId) continue;
        const id = member.userId;
        if (!map[id]) map[id] = { user: member.user, amount: 0 };
        map[id].amount += Number(member.share);
      }
    } else {
      // someone else paid so i owe the creator my share
      const myEntry = expense.members.find((m) => m.userId === userId);
      if (!myEntry) continue;
      const id = expense.createdById;
      if (!map[id]) map[id] = { user: expense.createdBy, amount: 0 };
      map[id].amount -= Number(myEntry.share);
    }
  }

  return Object.values(map).map((b) => ({
    user: b.user,
    amount: Math.abs(b.amount).toFixed(2),
    direction: b.amount > 0 ? 'owes_me' : 'i_owe',
  }));
};

module.exports = { calculate };
