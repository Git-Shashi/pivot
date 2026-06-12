import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { updateApplication } from "@/api/applications";
import { listResumes } from "@/api/resumes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITY_OPTIONS, WORK_MODE_OPTIONS } from "@/lib/constants";

const schema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  roleTitle: z.string().min(1, "Role title is required"),
  jobDescription: z.string().optional(),
  jobUrl: z.string().optional(),
  appliedDate: z.string().optional(),
  location: z.string().optional(),
  workMode: z.string().optional(),
  salaryRange: z.string().optional(),
  notes: z.string().optional(),
  priority: z.string().optional(),
  resumeId: z.string().optional(),
});

export default function EditApplicationDialog({ open, onOpenChange, application, onSaved }) {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    if (open) {
      listResumes()
        .then((res) => setResumes(res.data.data))
        .catch(() => {});
    }
  }, [open]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (open && application) {
      reset({
        companyName: application.companyName || "",
        roleTitle: application.roleTitle || "",
        jobDescription: application.jobDescription || "",
        jobUrl: application.jobUrl || "",
        appliedDate: application.appliedDate || "",
        location: application.location || "",
        workMode: application.workMode || "",
        salaryRange: application.salaryRange || "",
        notes: application.notes || "",
        priority: application.priority || "",
        resumeId: application.resumeInfo?.resume?.id ? String(application.resumeInfo.resume.id) : "",
      });
    }
  }, [open, application, reset]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        companyName: values.companyName,
        roleTitle: values.roleTitle,
        jobDescription: values.jobDescription || null,
        jobUrl: values.jobUrl || null,
        appliedDate: values.appliedDate || null,
        location: values.location || null,
        workMode: values.workMode || null,
        salaryRange: values.salaryRange || null,
        notes: values.notes || null,
        priority: values.priority || null,
        resumeId: values.resumeId ? Number(values.resumeId) : null,
      };
      const res = await updateApplication(application.id, payload);
      toast.success("Application updated");
      onSaved(res.data.data);
      onOpenChange(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update application");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-companyName">Company</Label>
              <Input id="edit-companyName" {...register("companyName")} />
              {errors.companyName && (
                <p className="text-sm text-destructive">{errors.companyName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-roleTitle">Role</Label>
              <Input id="edit-roleTitle" {...register("roleTitle")} />
              {errors.roleTitle && (
                <p className="text-sm text-destructive">{errors.roleTitle.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input id="edit-location" {...register("location")} />
            </div>
            <div className="space-y-2">
              <Label>Work mode</Label>
              <Controller
                name="workMode"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select work mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {WORK_MODE_OPTIONS.map((opt) => (
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
              <Label htmlFor="edit-salaryRange">Salary range</Label>
              <Input id="edit-salaryRange" {...register("salaryRange")} />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map((opt) => (
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
              <Label htmlFor="edit-appliedDate">Applied date</Label>
              <Input id="edit-appliedDate" type="date" {...register("appliedDate")} />
            </div>
            {resumes.length > 0 && (
              <div className="space-y-2">
                <Label>Resume</Label>
                <Controller
                  name="resumeId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Use default resume" />
                      </SelectTrigger>
                      <SelectContent>
                        {resumes.map((r) => (
                          <SelectItem key={r.id} value={String(r.id)}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-jobUrl">Job posting URL</Label>
            <Input id="edit-jobUrl" {...register("jobUrl")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-jobDescription">Job description</Label>
            <Textarea id="edit-jobDescription" rows={5} {...register("jobDescription")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea id="edit-notes" rows={3} {...register("notes")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
