const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.salesLog.deleteMany();
  await prisma.carModel.deleteMany();
  await prisma.incentiveSlab.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const adminPassword = await bcrypt.hash("admin123", 10);
  const salesPassword = await bcrypt.hash("sales123", 10);

  await prisma.user.createMany({
    data: [
      {
        email: "admin@test.com",
        password: adminPassword,
        name: "Admin User",
        role: "ADMIN",
      },
      {
        email: "sales@test.com",
        password: salesPassword,
        name: "Sales Officer",
        role: "SALES",
      },
    ],
  });

  // Create Car Models
  await prisma.carModel.createMany({
    data: [
      { name: "Model S", baseSuffix: "MS", variant: "Long Range" },
      { name: "Model 3", baseSuffix: "M3", variant: "Performance" },
      { name: "Model X", baseSuffix: "MX", variant: "Plaid" },
      { name: "Model Y", baseSuffix: "MY", variant: "Standard Range" },
    ],
  });

  // Create Incentive Slabs
  await prisma.incentiveSlab.createMany({
    data: [
      { minCars: 1, maxCars: 3, payoutPerCar: 1000 },
      { minCars: 4, maxCars: 7, payoutPerCar: 2000 },
      { minCars: 8, maxCars: null, payoutPerCar: 3500 },
    ],
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
