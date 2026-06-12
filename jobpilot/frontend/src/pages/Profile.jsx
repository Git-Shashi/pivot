import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Star, Trash2, Upload, FileText } from "lucide-react";
import { updateProfile } from "@/api/auth";
import { listResumes, uploadResume, setDefaultResume, deleteResume } from "@/api/resumes";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().optional(),
  linkedinUrl: z.string().optional(),
});

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [resumesLoading, setResumesLoading] = useState(true);
  const [uploadLabel, setUploadLabel] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      linkedinUrl: user?.linkedinUrl || "",
    },
  });

  const loadResumes = () => {
    listResumes()
      .then((res) => setResumes(res.data.data))
      .finally(() => setResumesLoading(false));
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const onSubmit = async (values) => {
    try {
      const res = await updateProfile({
        fullName: values.fullName,
        phone: values.phone || null,
        linkedinUrl: values.linkedinUrl || null,
      });
      updateUser(res.data.data);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update profile");
    }
  };

  const onUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadLabel.trim()) return;
    setUploading(true);
    try {
      const res = await uploadResume(uploadFile, uploadLabel.trim());
      setResumes((prev) => [...prev, res.data.data]);
      setUploadFile(null);
      setUploadLabel("");
      toast.success("Resume uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not upload resume");
    } finally {
      setUploading(false);
    }
  };

  const onSetDefault = async (resume) => {
    try {
      const res = await setDefaultResume(resume.id);
      setResumes((prev) =>
        prev.map((r) => ({ ...r, isDefault: r.id === res.data.data.id }))
      );
      toast.success("Default resume updated");
    } catch {
      toast.error("Could not set default resume");
    }
  };

  const onDelete = async () => {
    try {
      await deleteResume(deleteTarget.id);
      setResumes((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      toast.success("Resume deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete resume");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" {...register("fullName")} />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input id="linkedinUrl" {...register("linkedinUrl")} />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumes</CardTitle>
          <CardDescription>
            Upload resumes and mark one as default for new applications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {resumesLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : resumes.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <FileText className="size-8 text-muted-foreground" />
              <p className="text-sm font-medium">No resumes uploaded yet</p>
              <p className="text-sm text-muted-foreground">
                Upload a resume below so you can attach it to applications.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {resumes.map((resume) => (
                <li
                  key={resume.id}
                  className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <a
                        href={resume.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate text-sm font-medium hover:underline"
                      >
                        {resume.label}
                      </a>
                      <p className="truncate text-xs text-muted-foreground">{resume.fileName}</p>
                    </div>
                    {resume.isDefault && (
                      <span className="inline-flex h-5 shrink-0 items-center rounded-full bg-primary/10 px-2 text-xs font-medium text-primary">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {!resume.isDefault && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Set as default"
                        onClick={() => onSetDefault(resume)}
                      >
                        <Star className="size-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Delete"
                      onClick={() => setDeleteTarget(resume)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={onUpload} className="space-y-3 border-t pt-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="resume-label">Label</Label>
                <Input
                  id="resume-label"
                  placeholder="e.g. Software Engineer Resume"
                  value={uploadLabel}
                  onChange={(e) => setUploadLabel(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume-file">File</Label>
                <Input
                  id="resume-file"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className={cn("file:text-foreground")}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={uploading || !uploadFile || !uploadLabel.trim()}>
                <Upload className="size-4" />
                {uploading ? "Uploading..." : "Upload resume"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete resume?</DialogTitle>
            <DialogDescription>
              <span className="font-medium">{deleteTarget?.label}</span> will be permanently
              removed.
            </DialogDescription>
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
