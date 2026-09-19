const prisma = require('../config/prisma');

/*
  How balance works:
  - If I paid for an expense, everyone else in that expense owes me their share
  - If I'm a member of someone else's expense, I owe them my share

  We loop through all expenses involving the user and build a net balance per person.
  Positive = they owe me, Negative = I owe them
*/

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

  // key = other user's id, value = { user, net amount }
  const balanceMap = {};

  for (const expense of expenses) {
    if (expense.createdById === userId) {
      // I paid — each member owes me their share
      for (const member of expense.members) {
        if (member.userId === userId) continue;
        const id = member.userId;
        if (!balanceMap[id]) balanceMap[id] = { user: member.user, amount: 0 };
        balanceMap[id].amount += Number(member.share);
      }
    } else {
      // Someone else paid — I owe the creator my share
      const myEntry = expense.members.find((m) => m.userId === userId);
      if (!myEntry) continue;
      const id = expense.createdById;
      if (!balanceMap[id]) balanceMap[id] = { user: expense.createdBy, amount: 0 };
      balanceMap[id].amount -= Number(myEntry.share);
    }
  }

  // convert map to array and label direction
  return Object.values(balanceMap).map((b) => ({
    user: b.user,
    amount: Math.abs(b.amount).toFixed(2),
    direction: b.amount > 0 ? 'owes_me' : 'i_owe',
  }));
};

module.exports = { calculate };
