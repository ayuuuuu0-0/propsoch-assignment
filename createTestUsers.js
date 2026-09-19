const prisma = require('./src/config/prisma');

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@test.com' },
    update: {},
    create: {
      email: 'alice@test.com',
      password: 'dummy',
      currency: 'USD',
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@test.com' },
    update: {},
    create: {
      email: 'bob@test.com',
      password: 'dummy',
      currency: 'USD',
    },
  });

  console.log('Test users ready:');
  console.log('Alice ID:', alice.id, `(${alice.email})`);
  console.log('Bob ID:  ', bob.id, `(${bob.email})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
