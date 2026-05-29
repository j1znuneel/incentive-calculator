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
async function recalibrateSlabs() {
  const slabs = await prisma.incentiveSlab.findMany({
    orderBy: { minCars: "asc" },
  });

  for (let i = 0; i < slabs.length; i++) {
    const currentSlab = slabs[i];
    const nextSlab = slabs[i + 1];

    const newMaxCars = nextSlab ? nextSlab.minCars - 1 : null;

    if (currentSlab.maxCars !== newMaxCars) {
      await prisma.incentiveSlab.update({
        where: { id: currentSlab.id },
        data: { maxCars: newMaxCars },
      });
    }
  }
}

export async function addSlab(data: { minCars: number; payoutPerCar: number }) {
  // Check if a slab with this minCars already exists
  const existing = await prisma.incentiveSlab.findFirst({
    where: { minCars: data.minCars },
  });

  if (existing) {
    return { error: `A tier starting at ${data.minCars} already exists.` };
  }

  await prisma.incentiveSlab.create({ 
    data: {
      minCars: data.minCars,
      maxCars: null, // Will be recalibrated
      payoutPerCar: data.payoutPerCar,
    }
  });

  await recalibrateSlabs();
  revalidatePath("/admin");
  return { success: true };
}

export async function updateSlab(id: string, data: { minCars: number; payoutPerCar: number }) {
  // Check if another slab has this minCars
  const existing = await prisma.incentiveSlab.findFirst({
    where: { 
      minCars: data.minCars,
      NOT: { id },
    },
  });

  if (existing) {
    return { error: `Another tier starting at ${data.minCars} already exists.` };
  }

  await prisma.incentiveSlab.update({ 
    where: { id },
    data: { 
      minCars: data.minCars,
      payoutPerCar: data.payoutPerCar 
    } 
  });

  await recalibrateSlabs();
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteSlab(id: string) {
  try {
    await prisma.incentiveSlab.delete({ where: { id } });
    await recalibrateSlabs();
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
