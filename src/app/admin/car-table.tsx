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
import { addCar, updateCar, deleteCar } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation";

interface Car {
  id: string;
  name: string;
  baseSuffix: string;
  variant: string;
}

export function CarTable({ initialData }: { initialData: Car[] }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  async function handleAdd(formData: FormData) {
    const name = formData.get("name") as string;
    const baseSuffix = formData.get("baseSuffix") as string;
    const variant = formData.get("variant") as string;

    try {
      await addCar({ name, baseSuffix, variant });
      setIsAddOpen(false);
      toast({ title: "Success", description: "Car added successfully." });
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to add car." });
    }
  }

  async function handleUpdate(formData: FormData) {
    if (!editingCar) return;
    const name = formData.get("name") as string;
    const baseSuffix = formData.get("baseSuffix") as string;
    const variant = formData.get("variant") as string;

    try {
      await updateCar(editingCar.id, { name, baseSuffix, variant });
      setEditingCar(null);
      toast({ title: "Success", description: "Car updated successfully." });
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to update car." });
    }
  }

  async function confirmDelete() {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const result = await deleteCar(deletingId);
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else {
        toast({ title: "Success", description: "Car deleted successfully." });
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete car." });
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Vehicle Inventory</h3>
          <p className="text-sm text-zinc-500">Manage models available for reporting.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-white text-black hover:bg-zinc-200 text-base font-bold h-12 px-6">
              <Plus className="h-5 w-5 mr-2" />
              Add Car Model
            </Button>
          </DialogTrigger>
          <DialogContent className="border-zinc-800 bg-zinc-950 sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Add Car Model</DialogTitle>
            </DialogHeader>
            <form action={handleAdd} className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold">Name</Label>
                <Input id="name" name="name" placeholder="Model S" required className="h-12 text-base" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="baseSuffix" className="text-base font-semibold">Base Suffix</Label>
                <Input id="baseSuffix" name="baseSuffix" placeholder="MS" required className="h-12 text-base" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="variant" className="text-base font-semibold">Variant</Label>
                <Input id="variant" name="variant" placeholder="Long Range" required className="h-12 text-base" />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" size="lg" className="bg-white text-black hover:bg-zinc-200 w-full font-bold h-12 text-base">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border border-zinc-800 overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-zinc-800 h-14 bg-zinc-900/30">
              <TableHead className="text-zinc-400 font-bold text-sm px-6">Name</TableHead>
              <TableHead className="text-zinc-400 font-bold text-sm px-6">Base Suffix</TableHead>
              <TableHead className="text-zinc-400 font-bold text-sm px-6">Variant</TableHead>
              <TableHead className="text-right text-zinc-400 font-bold text-sm px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.map((car) => (
              <TableRow key={car.id} className="border-zinc-800 h-16 hover:bg-zinc-900/40 transition-colors">
                <TableCell className="font-bold text-white text-base px-6">{car.name}</TableCell>
                <TableCell className="text-zinc-300 text-base px-6">{car.baseSuffix}</TableCell>
                <TableCell className="text-zinc-300 text-base px-6">{car.variant}</TableCell>
                <TableCell className="text-right space-x-3 px-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingCar(car)}
                    className="h-10 w-10 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <Pencil className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingId(car.id)}
                    className="h-10 w-10 text-zinc-400 hover:text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {initialData.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-zinc-500 text-lg">
                  No car models found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingCar} onOpenChange={(open) => !open && setEditingCar(null)}>
        <DialogContent className="border-zinc-800 bg-zinc-950 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Car Model</DialogTitle>
          </DialogHeader>
          <form action={handleUpdate} className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-base font-semibold">Name</Label>
              <Input
                id="edit-name"
                name="name"
                defaultValue={editingCar?.name}
                required
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-baseSuffix" className="text-base font-semibold">Base Suffix</Label>
              <Input
                id="edit-baseSuffix"
                name="baseSuffix"
                defaultValue={editingCar?.baseSuffix}
                required
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-variant" className="text-base font-semibold">Variant</Label>
              <Input
                id="edit-variant"
                name="variant"
                defaultValue={editingCar?.variant}
                required
                className="h-12 text-base"
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" size="lg" className="bg-white text-black hover:bg-zinc-200 w-full font-bold h-12 text-base">Update</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        isOpen={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Delete Car Model"
        description="Are you sure you want to delete this car model? This action cannot be undone and will fail if there are associated sales records."
      />
    </div>
  );
}
