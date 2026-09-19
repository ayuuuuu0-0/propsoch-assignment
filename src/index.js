const app = require('./app');
const prisma = require('./config/prisma');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// clean disconnect on shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
