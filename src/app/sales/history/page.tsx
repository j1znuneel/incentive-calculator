import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSalesHistory } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { History as HistoryIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SalesHistoryPage() {
  const session = await getServerSession(authOptions);
  const history = await getSalesHistory(session?.user?.id as string);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
          <HistoryIcon className="h-8 w-8 text-zinc-400" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white">Sales History</h1>
          <p className="text-sm text-zinc-500 mt-1">Review your historical sales logs and reporting activity.</p>
        </div>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Reporting Log</CardTitle>
          <CardDescription className="text-xs text-zinc-500">
            A chronological record of all submitted sales data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-zinc-800 overflow-x-auto">
            <Table>
              <TableHeader className="bg-zinc-900/50">
                <TableRow className="hover:bg-transparent border-zinc-800">
                  <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Reporting Month</TableHead>
                  <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Vehicle Model</TableHead>
                  <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Variant</TableHead>
                  <TableHead className="text-right text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Volume</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((log) => (
                  <TableRow key={log.id} className="border-zinc-800 hover:bg-zinc-800/20 transition-colors">
                    <TableCell className="font-medium text-white">
                      {format(parseISO(`${log.month}-01`), "MMMM yyyy")}
                    </TableCell>
                    <TableCell className="text-zinc-300">{log.carModel.name}</TableCell>
                    <TableCell className="text-zinc-500 text-xs">{log.carModel.variant}</TableCell>
                    <TableCell className="text-right font-bold text-white">{log.carsSold}</TableCell>
                  </TableRow>
                ))}
                {history.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-zinc-500 text-sm">
                      No sales history records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
