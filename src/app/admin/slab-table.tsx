"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addSlab, updateSlab, deleteSlab } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

interface Slab {
  id: string;
  minCars: number;
  maxCars: number | null;
  payoutPerCar: number;
}

export function SlabTable({ initialData }: { initialData: Slab[] }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSlab, setEditingSlab] = useState<Slab | null>(null);
  const { toast } = useToast();

  async function handleAdd(formData: FormData) {
    const minCars = parseInt(formData.get("minCars") as string);
    const maxCarsRaw = formData.get("maxCars") as string;
    const maxCars = maxCarsRaw === "" ? null : parseInt(maxCarsRaw);
    const payoutPerCar = parseFloat(formData.get("payoutPerCar") as string);

    try {
      await addSlab({ minCars, maxCars, payoutPerCar });
      setIsAddOpen(false);
      toast({ title: "Success", description: "Slab added successfully." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to add slab." });
    }
  }

  async function handleUpdate(formData: FormData) {
    if (!editingSlab) return;
    const minCars = parseInt(formData.get("minCars") as string);
    const maxCarsRaw = formData.get("maxCars") as string;
    const maxCars = maxCarsRaw === "" ? null : parseInt(maxCarsRaw);
    const payoutPerCar = parseFloat(formData.get("payoutPerCar") as string);

    try {
      await updateSlab(editingSlab.id, { minCars, maxCars, payoutPerCar });
      setEditingSlab(null);
      toast({ title: "Success", description: "Slab updated successfully." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update slab." });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this slab?")) return;
    try {
      const result = await deleteSlab(id);
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else {
        toast({ title: "Success", description: "Slab deleted successfully." });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete slab." });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Incentive Slab
            </Button>
          </DialogTrigger>
          <DialogContent className="border-zinc-800 bg-zinc-950">
            <DialogHeader>
              <DialogTitle>Add Incentive Slab</DialogTitle>
            </DialogHeader>
            <form action={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minCars">Min Cars</Label>
                  <Input id="minCars" name="minCars" type="number" placeholder="1" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxCars">Max Cars (Optional)</Label>
                  <Input id="maxCars" name="maxCars" type="number" placeholder="3" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payoutPerCar">Payout Per Car ($)</Label>
                <Input id="payoutPerCar" name="payoutPerCar" type="number" step="0.01" placeholder="1000.00" required />
              </div>
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border border-zinc-800">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-zinc-800">
              <TableHead>Range</TableHead>
              <TableHead>Payout Per Car</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.map((slab) => (
              <TableRow key={slab.id} className="border-zinc-800">
                <TableCell className="font-medium">
                  {slab.minCars}{slab.maxCars ? ` - ${slab.maxCars}` : "+"} Cars
                </TableCell>
                <TableCell>{formatCurrency(slab.payoutPerCar)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingSlab(slab)}
                    className="h-8 w-8 text-zinc-400 hover:text-white"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(slab.id)}
                    className="h-8 w-8 text-zinc-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {initialData.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  No incentive slabs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingSlab} onOpenChange={(open) => !open && setEditingSlab(null)}>
        <DialogContent className="border-zinc-800 bg-zinc-950">
          <DialogHeader>
            <DialogTitle>Edit Incentive Slab</DialogTitle>
          </DialogHeader>
          <form action={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-minCars">Min Cars</Label>
                <Input
                  id="edit-minCars"
                  name="minCars"
                  type="number"
                  defaultValue={editingSlab?.minCars}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-maxCars">Max Cars (Optional)</Label>
                <Input
                  id="edit-maxCars"
                  name="maxCars"
                  type="number"
                  defaultValue={editingSlab?.maxCars ?? ""}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-payoutPerCar">Payout Per Car ($)</Label>
              <Input
                id="edit-payoutPerCar"
                name="payoutPerCar"
                type="number"
                step="0.01"
                defaultValue={editingSlab?.payoutPerCar}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
