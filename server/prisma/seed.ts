import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash("Password123!", 10);
  const userPasswordHash = await bcrypt.hash("UserPassword123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@clientadmin.dev" },
    update: {},
    create: {
      email: "admin@clientadmin.dev",
      name: "Demo Admin",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "user@clientadmin.dev" },
    update: {},
    create: {
      email: "user@clientadmin.dev",
      name: "Demo User",
      passwordHash: userPasswordHash,
      role: "USER",
    },
  });

  const customer = await prisma.customer.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      name: "Alice Andersson",
      email: "alice@example.com",
      phone: "+46 70 123 45 67",
      status: "ACTIVE",
      notes: "Long-term customer with expansion potential.",
    },
  });

  await prisma.deal.createMany({
    data: [
      {
        customerId: customer.id,
        title: "Website redesign",
        description: "High priority migration to new design system.",
        priority: "HIGH",
        status: "IN_PROGRESS",
      },
      {
        customerId: customer.id,
        title: "Hosting renewal",
        priority: "LOW",
        status: "OPEN",
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
