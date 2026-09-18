// src/config/prisma.js
// Single shared Prisma client — imported everywhere we need the DB
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;
