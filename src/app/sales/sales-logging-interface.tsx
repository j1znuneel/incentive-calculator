"use client";

import { useState, useMemo } from "react";
import { format, startOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveSalesLog } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, CarFront, Calculator, Minus, Plus } from "lucide-react";

interface Car {
  id: string;
  name: string;
  variant: string;
}

interface Slab {
  id: string;
  minCars: number;
  maxCars: number | null;
  payoutPerCar: number;
}

export function SalesLoggingInterface({ 
  cars, 
  slabs, 
  userId 
}: { 
  cars: Car[]; 
  slabs: Slab[]; 
  userId: string;
}) {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));
  const [salesData, setSalesData] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const totalCars = useMemo(() => {
    return Object.values(salesData).reduce((sum, val) => sum + (val || 0), 0);
  }, [salesData]);

  const incentiveInfo = useMemo(() => {
    const slab = slabs.find(s => 
      totalCars >= s.minCars && (s.maxCars === null || totalCars <= s.maxCars)
    );
    
    const payoutPerCar = slab?.payoutPerCar || 0;
    const totalPayout = totalCars * payoutPerCar;
    
    return { payoutPerCar, totalPayout, slab };
  }, [totalCars, slabs]);

  const handleIncrement = (carId: string) => {
    setSalesData(prev => ({ ...prev, [carId]: (prev[carId] || 0) + 1 }));
  };

  const handleDecrement = (carId: string) => {
    setSalesData(prev => {
      const current = prev[carId] || 0;
      if (current <= 0) return prev;
      return { ...prev, [carId]: current - 1 };
    });
  };

  async function handleSave() {
    setIsSaving(true);
    try {
      for (const [carId, count] of Object.entries(salesData)) {
        if (count > 0) {
          await saveSalesLog(userId, carId, selectedMonth, count);
        }
      }
      toast({ title: "Success", description: "Sales logs saved successfully." });
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to save logs." });
    } finally {
      setIsSaving(false);
    }
  }

  const months = useMemo(() => {
    const arr = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = startOfMonth(new Date(now.getFullYear(), now.getMonth() - i, 1));
      arr.push({
        value: format(d, "yyyy-MM"),
        label: format(d, "MMMM yyyy"),
      });
    }
    return arr;
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium">Reporting Period</CardTitle>
            <CardDescription className="text-xs text-zinc-500">Select the month for sales volume entry.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[200px] border-zinc-800 bg-zinc-950">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent className="border-zinc-800 bg-zinc-950">
                {months.map(m => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium">Volume Entry</CardTitle>
            <CardDescription className="text-xs text-zinc-500">Enter quantity sold for each vehicle specification.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cars.map((car) => (
                <div key={car.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 flex items-center justify-between group hover:bg-zinc-800/40 transition-colors">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-zinc-200">{car.name}</p>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">{car.variant}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-lg border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-white"
                      onClick={() => handleDecrement(car.id)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <div className="w-8 text-center font-bold text-lg text-white">
                      {salesData[car.id] || 0}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-lg border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-white"
                      onClick={() => handleIncrement(car.id)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2 flex justify-end">
              <Button 
                onClick={handleSave} 
                disabled={isSaving || totalCars === 0}
                className="bg-white text-black hover:bg-zinc-200 font-semibold px-8"
              >
                {isSaving ? "Processing..." : "Submit Report"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <Card className="border-zinc-800 bg-zinc-900 sticky top-24 shadow-2xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-zinc-800 via-zinc-400 to-zinc-800" />
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <TrendingUp className="h-5 w-5 text-zinc-400" />
              Real-time Metrics
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">Provisional calculation for current period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 flex items-center gap-2">
                  <CarFront className="h-4 w-4" />
                  Cumulative Volume
                </span>
                <span className="font-semibold text-white">{totalCars} Units</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Current Payout Tier
                </span>
                <span className="font-semibold text-white">
                  {incentiveInfo.slab 
                    ? `${incentiveInfo.slab.minCars}${incentiveInfo.slab.maxCars ? `-${incentiveInfo.slab.maxCars}` : "+"} Tier` 
                    : "Base"}
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800 space-y-4">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Incentive Structure</p>
              <div className="space-y-2">
                {slabs.map((slab) => {
                  const isActive = incentiveInfo.slab?.id === slab.id;
                  return (
                    <div 
                      key={slab.id} 
                      className={`text-[11px] p-3 rounded-lg flex justify-between items-center transition-all ${
                        isActive 
                          ? "bg-white text-black font-bold shadow-lg scale-[1.02]" 
                          : "bg-zinc-800/40 text-zinc-500"
                      }`}
                    >
                      <span>
                        {slab.minCars}{slab.maxCars ? `-${slab.maxCars}` : "+"} units
                      </span>
                      <span>{formatCurrency(slab.payoutPerCar)} / unit</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800 space-y-1">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Estimated Payout</p>
              <div className="text-4xl font-bold tracking-tight text-white">
                {formatCurrency(incentiveInfo.totalPayout)}
              </div>
              <p className="text-[11px] text-zinc-500">
                Rate: {formatCurrency(incentiveInfo.payoutPerCar)} per unit
              </p>
            </div>

            {totalCars > 0 && !incentiveInfo.slab && (
              <div className="p-3 rounded bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-400 italic">
                You haven&apos;t reached the minimum slab requirement (1+ cars).
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
