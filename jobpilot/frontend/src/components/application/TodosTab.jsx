import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, ClipboardList } from "lucide-react";
import { createTodo, toggleTodo, deleteTodo } from "@/api/todos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export default function TodosTab({ appId, todos, onChange }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      const res = await createTodo({
        title: title.trim(),
        dueDate: dueDate || null,
        applicationId: appId,
      });
      onChange((prev) => [...prev, res.data.data]);
      setTitle("");
      setDueDate("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add todo");
    } finally {
      setSubmitting(false);
    }
  };

  const onToggle = async (todo) => {
    try {
      const res = await toggleTodo(todo.id);
      onChange((prev) => prev.map((t) => (t.id === todo.id ? res.data.data : t)));
    } catch {
      toast.error("Could not update todo");
    }
  };

  const onDelete = async (todo) => {
    try {
      await deleteTodo(todo.id);
      onChange((prev) => prev.filter((t) => t.id !== todo.id));
    } catch {
      toast.error("Could not delete todo");
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={onAdd} className="flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Add a follow-up task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1"
        />
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="sm:w-40"
        />
        <Button type="submit" disabled={submitting || !title.trim()}>
          <Plus className="size-4" />
          Add
        </Button>
      </form>

      {todos.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <ClipboardList className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium">No tasks yet</p>
          <p className="text-sm text-muted-foreground">
            Add follow-ups and reminders for this application.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 rounded-lg border px-3 py-2"
            >
              <Checkbox
                checked={todo.isCompleted}
                onCheckedChange={() => onToggle(todo)}
              />
              <div className="flex-1">
                <p className={cn("text-sm", todo.isCompleted && "text-muted-foreground line-through")}>
                  {todo.title}
                </p>
                {todo.dueDate && (
                  <p className="text-xs text-muted-foreground">Due {todo.dueDate}</p>
                )}
              </div>
              <Button variant="ghost" size="icon-sm" onClick={() => onDelete(todo)}>
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
