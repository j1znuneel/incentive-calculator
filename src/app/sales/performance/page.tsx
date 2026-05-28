import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSalesHistory, getIncentiveSlabs } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { BarChart3, TrendingUp, Target, Award } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PerformancePage() {
  const session = await getServerSession(authOptions);
  const history = await getSalesHistory(session?.user?.id as string);
  const slabs = await getIncentiveSlabs();

  interface MonthlyPerformance {
    month: string;
    totalUnits: number;
  }

  // Aggregate by month
  const performanceByMonth = history.reduce((acc, log) => {
    if (!acc[log.month]) {
      acc[log.month] = {
        month: log.month,
        totalUnits: 0,
      };
    }
    acc[log.month].totalUnits += log.carsSold;
    return acc;
  }, {} as Record<string, MonthlyPerformance>);

  const sortedMonths = Object.values(performanceByMonth).sort((a, b) => b.month.localeCompare(a.month));

  const monthsWithPayouts = sortedMonths.map(m => {
    const slab = slabs.find(s => 
      m.totalUnits >= s.minCars && (s.maxCars === null || m.totalUnits <= s.maxCars)
    );
    const payoutPerCar = slab?.payoutPerCar || 0;
    const totalPayout = m.totalUnits * payoutPerCar;
    return { ...m, payoutPerCar, totalPayout, slab };
  });

  const totalEarnings = monthsWithPayouts.reduce((sum, m) => sum + m.totalPayout, 0);
  const totalUnitsAllTime = monthsWithPayouts.reduce((sum, m) => sum + m.totalUnits, 0);
  const avgMonthlyUnits = monthsWithPayouts.length > 0 ? totalUnitsAllTime / monthsWithPayouts.length : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
          <BarChart3 className="h-8 w-8 text-zinc-400" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white">Performance Metrics</h1>
          <p className="text-sm text-zinc-500 mt-1">Analytical overview of your sales performance and incentive earnings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Cumulative Earnings</CardDescription>
            <CardTitle className="text-3xl font-bold text-white">{formatCurrency(totalEarnings)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-emerald-500">
              <TrendingUp className="h-3 w-3" />
              <span>Total payouts to date</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Total Units Sold</CardDescription>
            <CardTitle className="text-3xl font-bold text-white">{totalUnitsAllTime}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Target className="h-3 w-3" />
              <span>Units across all reporting periods</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Monthly Average</CardDescription>
            <CardTitle className="text-3xl font-bold text-white">{avgMonthlyUnits.toFixed(1)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Award className="h-3 w-3" />
              <span>Average units per month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Monthly Payout Breakdown</CardTitle>
          <CardDescription className="text-xs text-zinc-500">Performance summary aggregated by reporting month.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthsWithPayouts.map((m) => (
              <div key={m.month} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-sm text-white">
                    {format(parseISO(`${m.month}-01`), "MMMM yyyy")}
                  </p>
                  <div className="flex items-center gap-3">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                      {m.totalUnits} Units
                    </p>
                    <span className="h-1 w-1 rounded-full bg-zinc-700" />
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                      {m.slab ? `${m.slab.minCars}${m.slab.maxCars ? `-${m.slab.maxCars}` : "+"} Tier` : "No Tier"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{formatCurrency(m.totalPayout)}</p>
                  <p className="text-[10px] text-zinc-500 font-medium">
                    {formatCurrency(m.payoutPerCar)} per unit
                  </p>
                </div>
              </div>
            ))}
            {monthsWithPayouts.length === 0 && (
              <div className="h-24 flex items-center justify-center text-zinc-500 text-sm">
                No performance data available yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
