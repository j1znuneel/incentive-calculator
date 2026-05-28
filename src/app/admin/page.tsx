import prisma from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarTable } from "./car-table";
import { SlabTable } from "./slab-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings2 } from "lucide-react";

export default async function AdminPage() {
  const cars = await prisma.carModel.findMany({
    orderBy: { createdAt: "desc" },
  });

  const slabs = await prisma.incentiveSlab.findMany({
    orderBy: { minCars: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">System Configuration</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage global inventory and incentive parameters.</p>
      </div>

      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="bg-zinc-900 border border-zinc-800 p-1 h-11">
          <TabsTrigger value="inventory" className="px-6 data-[state=active]:bg-zinc-800">Vehicle Inventory</TabsTrigger>
          <TabsTrigger value="slabs" className="px-6 data-[state=active]:bg-zinc-800">Incentive Tiers</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory" className="space-y-4 pt-2">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium">Model Management</CardTitle>
              <CardDescription className="text-xs">
                Configure vehicle specifications available for sales reporting.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CarTable initialData={cars} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="slabs" className="space-y-4 pt-2">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium">Payout Structure</CardTitle>
              <CardDescription className="text-xs">
                Define the incentive logic based on monthly sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SlabTable initialData={slabs} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
