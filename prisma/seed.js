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

  // Create Indian Car Models
  await prisma.carModel.createMany({
    data: [
      { name: "Maruti Suzuki Swift", baseSuffix: "SW", variant: "ZXI+" },
      { name: "Hyundai Creta", baseSuffix: "CR", variant: "SX (O)" },
      { name: "Mahindra Thar", baseSuffix: "TH", variant: "LX Hard Top" },
      { name: "Tata Nexon", baseSuffix: "NX", variant: "Fearless+" },
      { name: "Toyota Fortuner", baseSuffix: "FT", variant: "Legender" },
      { name: "Kia Seltos", baseSuffix: "SL", variant: "GT Line" },
    ],
  });

  // Create Incentive Slabs with INR values
  await prisma.incentiveSlab.createMany({
    data: [
      { minCars: 1, maxCars: 3, payoutPerCar: 5000 },
      { minCars: 4, maxCars: 7, payoutPerCar: 10000 },
      { minCars: 8, maxCars: 12, payoutPerCar: 15000 },
      { minCars: 13, maxCars: null, payoutPerCar: 25000 },
    ],
  });

  console.log("Seed data created successfully with Indian car models and INR values!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
