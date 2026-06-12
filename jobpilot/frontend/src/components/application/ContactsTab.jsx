import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Mail, Phone, Link2 } from "lucide-react";
import { addContact, updateContact, deleteContact } from "@/api/applications";
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

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  role: z.string().optional(),
  linkedinUrl: z.string().optional(),
  notes: z.string().optional(),
});

const emptyValues = { name: "", email: "", phone: "", role: "", linkedinUrl: "", notes: "" };

export default function ContactsTab({ appId, contacts, onChange }) {
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const addForm = useForm({ resolver: zodResolver(schema), defaultValues: emptyValues });
  const editForm = useForm({ resolver: zodResolver(schema) });

  const openEdit = (contact) => {
    setEditTarget(contact);
    editForm.reset({
      name: contact.name || "",
      email: contact.email || "",
      phone: contact.phone || "",
      role: contact.role || "",
      linkedinUrl: contact.linkedinUrl || "",
      notes: contact.notes || "",
    });
  };

  const buildPayload = (values) => ({
    name: values.name,
    email: values.email || null,
    phone: values.phone || null,
    role: values.role || null,
    linkedinUrl: values.linkedinUrl || null,
    notes: values.notes || null,
  });

  const onAdd = async (values) => {
    try {
      const res = await addContact(appId, buildPayload(values));
      onChange((prev) => [...prev, res.data.data]);
      toast.success("Contact added");
      setAddOpen(false);
      addForm.reset(emptyValues);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add contact");
    }
  };

  const onEdit = async (values) => {
    try {
      const res = await updateContact(appId, editTarget.id, buildPayload(values));
      onChange((prev) => prev.map((c) => (c.id === editTarget.id ? res.data.data : c)));
      toast.success("Contact updated");
      setEditTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update contact");
    }
  };

  const onDelete = async () => {
    try {
      await deleteContact(appId, deleteTarget.id);
      onChange((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      toast.success("Contact deleted");
    } catch {
      toast.error("Could not delete contact");
    } finally {
      setDeleteTarget(null);
    }
  };

  const renderForm = (form, onSubmit, submitLabel) => (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input id="contact-name" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-role">Role</Label>
          <Input id="contact-role" placeholder="Recruiter, Hiring Manager..." {...form.register("role")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" type="email" {...form.register("email")} />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-phone">Phone</Label>
          <Input id="contact-phone" {...form.register("phone")} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-linkedin">LinkedIn URL</Label>
        <Input id="contact-linkedin" {...form.register("linkedinUrl")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-notes">Notes</Label>
        <Textarea id="contact-notes" rows={3} {...form.register("notes")} />
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setAddOpen(false);
            setEditTarget(null);
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="size-4" />
          Add contact
        </Button>
      </div>

      {contacts.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No contacts added yet.</p>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <Card key={contact.id}>
              <CardContent className="flex items-start justify-between gap-4 py-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{contact.name}</span>
                    {contact.role && (
                      <span className="text-sm text-muted-foreground">· {contact.role}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    {contact.email && (
                      <a href={`mailto:${contact.email}`} className="flex items-center gap-1 hover:text-foreground">
                        <Mail className="size-3.5" /> {contact.email}
                      </a>
                    )}
                    {contact.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="size-3.5" /> {contact.phone}
                      </span>
                    )}
                    {contact.linkedinUrl && (
                      <a
                        href={contact.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:text-foreground"
                      >
                        <Link2 className="size-3.5" /> LinkedIn
                      </a>
                    )}
                  </div>
                  {contact.notes && <p className="text-sm whitespace-pre-wrap">{contact.notes}</p>}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={() => openEdit(contact)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(contact)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add contact</DialogTitle>
          </DialogHeader>
          {renderForm(addForm, onAdd, "Add contact")}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit contact</DialogTitle>
          </DialogHeader>
          {renderForm(editForm, onEdit, "Save changes")}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete contact?</DialogTitle>
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
