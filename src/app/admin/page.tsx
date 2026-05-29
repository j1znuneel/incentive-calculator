import prisma from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarTable } from "./car-table";
import { SlabTable } from "./slab-table";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cars = await prisma.carModel.findMany({
    orderBy: { createdAt: "desc" },
  });

  const slabs = await prisma.incentiveSlab.findMany({
    orderBy: { minCars: "asc" },
  });

  return (
    <div className="space-y-8 py-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">System Configuration</h1>
        <p className="text-md text-zinc-400">Manage global inventory and incentive parameters.</p>
      </div>

      <Tabs defaultValue="inventory" className="space-y-8">
        <TabsList className="bg-zinc-900 border border-zinc-800 p-1.5 h-14 w-full sm:w-auto">
          <TabsTrigger value="inventory" className="px-10 text-sm font-semibold data-[state=active]:bg-zinc-800 h-full transition-all">Vehicle Inventory</TabsTrigger>
          <TabsTrigger value="slabs" className="px-10 text-sm font-semibold data-[state=active]:bg-zinc-800 h-full transition-all">Incentive Tiers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="space-y-6 outline-none">
          <Card className="border-zinc-800 bg-zinc-900/40 shadow-2xl backdrop-blur-sm">
            <CardContent className="p-8">
              <CarTable initialData={cars} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="slabs" className="space-y-6 outline-none">
          <Card className="border-zinc-800 bg-zinc-900/40 shadow-2xl backdrop-blur-sm">
            <CardContent className="p-8">
              <SlabTable initialData={slabs} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
