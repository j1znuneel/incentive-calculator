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
  await prisma.carModel.delete({ where: { id } });
  revalidatePath("/admin");
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
  await prisma.incentiveSlab.delete({ where: { id } });
  revalidatePath("/admin");
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
