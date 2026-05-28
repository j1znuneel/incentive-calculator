import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { SalesLoggingInterface } from "./sales-logging-interface";

export const dynamic = "force-dynamic";

export default async function SalesPage() {
  const session = await getServerSession(authOptions);
  
  const cars = await prisma.carModel.findMany({
    orderBy: { name: "asc" },
  });

  const slabs = await prisma.incentiveSlab.findMany({
    orderBy: { minCars: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Performance Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">Monitor sales volume and track incentive performance in real-time.</p>
      </div>
      
      <SalesLoggingInterface 
        cars={cars} 
        slabs={slabs} 
        userId={session?.user?.id as string} 
      />
    </div>
  );
}
