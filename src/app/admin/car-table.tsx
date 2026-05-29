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

interface Car {
  id: string;
  name: string;
  baseSuffix: string;
  variant: string;
}

export function CarTable({ initialData }: { initialData: Car[] }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
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

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this car?")) return;
    try {
      const result = await deleteCar(id);
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
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Car Model
            </Button>
          </DialogTrigger>
          <DialogContent className="border-zinc-800 bg-zinc-950">
            <DialogHeader>
              <DialogTitle>Add Car Model</DialogTitle>
            </DialogHeader>
            <form action={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Model S" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="baseSuffix">Base Suffix</Label>
                <Input id="baseSuffix" name="baseSuffix" placeholder="MS" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="variant">Variant</Label>
                <Input id="variant" name="variant" placeholder="Long Range" required />
              </div>
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border border-zinc-800 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-zinc-800">
              <TableHead>Name</TableHead>
              <TableHead>Base Suffix</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.map((car) => (
              <TableRow key={car.id} className="border-zinc-800">
                <TableCell className="font-medium">{car.name}</TableCell>
                <TableCell>{car.baseSuffix}</TableCell>
                <TableCell>{car.variant}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingCar(car)}
                    className="h-8 w-8 text-zinc-400 hover:text-white"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(car.id)}
                    className="h-8 w-8 text-zinc-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {initialData.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No car models found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingCar} onOpenChange={(open) => !open && setEditingCar(null)}>
        <DialogContent className="border-zinc-800 bg-zinc-950">
          <DialogHeader>
            <DialogTitle>Edit Car Model</DialogTitle>
          </DialogHeader>
          <form action={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                name="name"
                defaultValue={editingCar?.name}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-baseSuffix">Base Suffix</Label>
              <Input
                id="edit-baseSuffix"
                name="baseSuffix"
                defaultValue={editingCar?.baseSuffix}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-variant">Variant</Label>
              <Input
                id="edit-variant"
                name="variant"
                defaultValue={editingCar?.variant}
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
