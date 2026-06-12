import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ListChecks } from "lucide-react";
import { addRound, updateRound, deleteRound } from "@/api/applications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoundResultBadge } from "@/components/StatusBadge";
import { ROUND_TYPE_OPTIONS, ROUND_TYPE_LABELS, ROUND_RESULT_OPTIONS } from "@/lib/constants";

const createSchema = z.object({
  roundType: z.string().min(1, "Round type is required"),
  scheduledAt: z.string().optional(),
  notes: z.string().optional(),
});

const updateSchema = z.object({
  roundType: z.string().min(1, "Round type is required"),
  scheduledAt: z.string().optional(),
  result: z.string().min(1, "Result is required"),
  notes: z.string().optional(),
});

function toDateTimeLocal(value) {
  if (!value) return "";
  return value.slice(0, 16);
}

function toIsoOrNull(value) {
  if (!value) return null;
  return value.length === 16 ? `${value}:00` : value;
}

export default function RoundsTab({ appId, rounds, onChange }) {
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const addForm = useForm({
    resolver: zodResolver(createSchema),
    defaultValues: { roundType: "", scheduledAt: "", notes: "" },
  });

  const editForm = useForm({
    resolver: zodResolver(updateSchema),
  });

  const openEdit = (round) => {
    setEditTarget(round);
    editForm.reset({
      roundType: round.roundType,
      scheduledAt: toDateTimeLocal(round.scheduledAt),
      result: round.result,
      notes: round.notes || "",
    });
  };

  const onAdd = async (values) => {
    try {
      const res = await addRound(appId, {
        roundType: values.roundType,
        scheduledAt: toIsoOrNull(values.scheduledAt),
        notes: values.notes || null,
      });
      onChange((prev) => [...prev, res.data.data]);
      toast.success("Round added");
      setAddOpen(false);
      addForm.reset({ roundType: "", scheduledAt: "", notes: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add round");
    }
  };

  const onEdit = async (values) => {
    try {
      const res = await updateRound(appId, editTarget.id, {
        roundType: values.roundType,
        scheduledAt: toIsoOrNull(values.scheduledAt),
        result: values.result,
        notes: values.notes || null,
      });
      onChange((prev) => prev.map((r) => (r.id === editTarget.id ? res.data.data : r)));
      toast.success("Round updated");
      setEditTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update round");
    }
  };

  const onDelete = async () => {
    try {
      await deleteRound(appId, deleteTarget.id);
      onChange((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      toast.success("Round deleted");
    } catch {
      toast.error("Could not delete round");
    } finally {
      setDeleteTarget(null);
    }
  };

  const sorted = [...rounds].sort((a, b) => (a.roundNumber ?? 0) - (b.roundNumber ?? 0));

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="size-4" />
          Add round
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <ListChecks className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium">No interview rounds yet</p>
          <p className="text-sm text-muted-foreground">
            Track each stage of the interview process as it happens.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((round) => (
            <Card key={round.id}>
              <CardContent className="flex items-start justify-between gap-4 py-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      Round {round.roundNumber}: {ROUND_TYPE_LABELS[round.roundType] ?? round.roundType}
                    </span>
                    <RoundResultBadge result={round.result} />
                  </div>
                  {round.scheduledAt && (
                    <p className="text-sm text-muted-foreground">
                      Scheduled: {new Date(round.scheduledAt).toLocaleString()}
                    </p>
                  )}
                  {round.notes && <p className="text-sm whitespace-pre-wrap">{round.notes}</p>}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={() => openEdit(round)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(round)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add round dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add interview round</DialogTitle>
          </DialogHeader>
          <form onSubmit={addForm.handleSubmit(onAdd)} className="space-y-4">
            <div className="space-y-2">
              <Label>Round type</Label>
              <Controller
                name="roundType"
                control={addForm.control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select round type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROUND_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {addForm.formState.errors.roundType && (
                <p className="text-sm text-destructive">
                  {addForm.formState.errors.roundType.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-scheduledAt">Scheduled at</Label>
              <Input id="add-scheduledAt" type="datetime-local" {...addForm.register("scheduledAt")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-notes">Notes</Label>
              <Textarea id="add-notes" rows={3} {...addForm.register("notes")} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addForm.formState.isSubmitting}>
                Add round
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit round dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit interview round</DialogTitle>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(onEdit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Round type</Label>
              <Controller
                name="roundType"
                control={editForm.control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select round type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROUND_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Result</Label>
              <Controller
                name="result"
                control={editForm.control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select result" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROUND_RESULT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-scheduledAt">Scheduled at</Label>
              <Input id="edit-scheduledAt" type="datetime-local" {...editForm.register("scheduledAt")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-round-notes">Notes</Label>
              <Textarea id="edit-round-notes" rows={3} {...editForm.register("notes")} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditTarget(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={editForm.formState.isSubmitting}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete round?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
