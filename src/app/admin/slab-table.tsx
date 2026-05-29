"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
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
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation";

interface Slab {
  id: string;
  minCars: number;
  maxCars: number | null;
  payoutPerCar: number;
}

export function SlabTable({ initialData }: { initialData: Slab[] }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSlab, setEditingSlab] = useState<Slab | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  async function handleAdd(formData: FormData) {
    const minCars = parseInt(formData.get("minCars") as string);
    const payoutPerCar = parseFloat(formData.get("payoutPerCar") as string);

    setIsSubmitting(true);
    try {
      const result = await addSlab({ minCars, payoutPerCar });
      if (result?.error) {
        toast({ variant: "destructive", title: "Configuration Error", description: result.error });
      } else {
        setIsAddOpen(false);
        toast({ title: "Success", description: "Tiers recalibrated successfully." });
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to add tier." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(formData: FormData) {
    if (!editingSlab) return;
    const minCars = parseInt(formData.get("minCars") as string);
    const payoutPerCar = parseFloat(formData.get("payoutPerCar") as string);

    setIsSubmitting(true);
    try {
      const result = await updateSlab(editingSlab.id, { minCars, payoutPerCar });
      if (result?.error) {
        toast({ variant: "destructive", title: "Configuration Error", description: result.error });
      } else {
        setEditingSlab(null);
        toast({ title: "Success", description: "Tiers updated and recalibrated." });
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to update tier." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const result = await deleteSlab(deletingId);
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else {
        toast({ title: "Success", description: "Tier removed and ranges recalibrated." });
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete tier." });
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Payout Structure</h3>
          <p className="text-sm text-zinc-500">Define incentive logic based on monthly volume.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-white text-black hover:bg-zinc-200 text-base font-bold h-12 px-6">
              <Plus className="h-5 w-5 mr-2" />
              Add Incentive Tier
            </Button>
          </DialogTrigger>
          <DialogContent className="border-zinc-800 bg-zinc-950 sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Add Incentive Tier</DialogTitle>
            </DialogHeader>
            <form action={handleAdd} className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="minCars" className="text-base font-semibold">Starting Car Count</Label>
                <Input id="minCars" name="minCars" type="number" placeholder="e.g. 15" required className="h-12 text-base" />
                <p className="text-[11px] text-zinc-500 italic">The upper limit of previous tiers will adjust automatically.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payoutPerCar" className="text-base font-semibold">Payout Per Car (₹)</Label>
                <Input id="payoutPerCar" name="payoutPerCar" type="number" step="1" placeholder="5000" required className="h-12 text-base" />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" disabled={isSubmitting} size="lg" className="bg-white text-black hover:bg-zinc-200 w-full font-bold h-12 text-base">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Recalibrating...
                    </>
                  ) : (
                    "Save Tier"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border border-zinc-800 overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-zinc-800 h-14 bg-zinc-900/30">
              <TableHead className="text-zinc-400 font-bold text-sm px-6">Range</TableHead>
              <TableHead className="text-zinc-400 font-bold text-sm px-6">Payout Per Car (₹)</TableHead>
              <TableHead className="text-right text-zinc-400 font-bold text-sm px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.map((slab) => (
              <TableRow key={slab.id} className="border-zinc-800 h-16 hover:bg-zinc-900/40 transition-colors">
                <TableCell className="font-bold text-white text-base px-6">
                  {slab.minCars}{slab.maxCars ? ` - ${slab.maxCars}` : "+"} Cars
                </TableCell>
                <TableCell className="text-zinc-300 text-base px-6">{formatCurrency(slab.payoutPerCar)}</TableCell>
                <TableCell className="text-right space-x-3 px-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingSlab(slab)}
                    className="h-10 w-10 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <Pencil className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingId(slab.id)}
                    className="h-10 w-10 text-zinc-400 hover:text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {initialData.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center text-zinc-500 text-lg">
                  No incentive tiers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingSlab} onOpenChange={(open) => !open && setEditingSlab(null)}>
        <DialogContent className="border-zinc-800 bg-zinc-950 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Incentive Tier</DialogTitle>
          </DialogHeader>
          <form action={handleUpdate} className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-minCars" className="text-base font-semibold">Starting Car Count</Label>
              <Input
                id="edit-minCars"
                name="minCars"
                type="number"
                defaultValue={editingSlab?.minCars}
                required
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-payoutPerCar" className="text-base font-semibold">Payout Per Car (₹)</Label>
              <Input
                id="edit-payoutPerCar"
                name="payoutPerCar"
                type="number"
                step="1"
                defaultValue={editingSlab?.payoutPerCar}
                required
                className="h-12 text-base"
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isSubmitting} size="lg" className="bg-white text-black hover:bg-zinc-200 w-full font-bold h-12 text-base">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Tier"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        isOpen={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Delete Incentive Tier"
        description="Are you sure you want to delete this incentive tier? All other tier ranges will be automatically recalibrated to maintain a continuous structure."
      />
    </div>
  );
}
