const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: "user@company.com" } });
  if (existing) return;

  const hashed = await bcrypt.hash("Pass@1234", 12);
  await prisma.user.create({
    data: {
      name: "Company User",
      email: "user@company.com",
      password: hashed,
      currency: "₹",
    },
  });

  console.log("Seed user created: user@company.com / Pass@1234");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
