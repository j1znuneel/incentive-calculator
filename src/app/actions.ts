"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Car Actions
export async function addCar(data: { name: string; baseSuffix: string; variant: string }) {
  await prisma.carModel.create({ data });
  revalidatePath("/admin");
}

export async function updateCar(id: string, data: { name: string; baseSuffix: string; variant: string }) {
  await prisma.carModel.update({ where: { id }, data });
  revalidatePath("/admin");
}

export async function deleteCar(id: string) {
  try {
    // Check if there are any sales logs associated with this car
    const salesCount = await prisma.salesLog.count({
      where: { carModelId: id },
    });

    if (salesCount > 0) {
      return {
        error: "Cannot delete car because it has associated sales records.",
      };
    }

    await prisma.carModel.delete({ where: { id } });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Delete car error:", error);
    return { error: "Failed to delete car. Please try again." };
  }
}

// Slab Actions
export async function addSlab(data: { minCars: number; maxCars: number | null; payoutPerCar: number }) {
  await prisma.incentiveSlab.create({ data });
  revalidatePath("/admin");
}

export async function updateSlab(id: string, data: { minCars: number; maxCars: number | null; payoutPerCar: number }) {
  await prisma.incentiveSlab.update({ where: { id }, data });
  revalidatePath("/admin");
}

export async function deleteSlab(id: string) {
  try {
    await prisma.incentiveSlab.delete({ where: { id } });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Delete slab error:", error);
    return { error: "Failed to delete slab. Please try again." };
  }
}

// Sales Actions
export async function saveSalesLog(userId: string, carModelId: string, month: string, carsSold: number) {
  await prisma.salesLog.upsert({
    where: {
      userId_carModelId_month: {
        userId,
        carModelId,
        month,
      },
    },
    update: {
      carsSold,
    },
    create: {
      userId,
      carModelId,
      month,
      carsSold,
    },
  });
  revalidatePath("/sales");
}

export async function getSalesHistory(userId: string) {
  return await prisma.salesLog.findMany({
    where: { userId },
    include: {
      carModel: true,
    },
    orderBy: { month: "desc" },
  });
}

export async function getIncentiveSlabs() {
  return await prisma.incentiveSlab.findMany({
    orderBy: { minCars: "asc" },
  });
}
