import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { createApplication } from "@/api/applications";
import { listResumes } from "@/api/resumes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  location: z.string().optional(),
  workMode: z.string().optional(),
  salaryRange: z.string().optional(),
  notes: z.string().optional(),
  priority: z.string().optional(),
  resumeId: z.string().optional(),
});

export default function NewApplication() {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    listResumes()
      .then((res) => setResumes(res.data.data))
      .catch(() => {});
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: "",
      roleTitle: "",
      jobDescription: "",
      jobUrl: "",
      location: "",
      workMode: "",
      salaryRange: "",
      notes: "",
      priority: "",
      resumeId: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const payload = {
        companyName: values.companyName,
        roleTitle: values.roleTitle,
        jobDescription: values.jobDescription || null,
        jobUrl: values.jobUrl || null,
        location: values.location || null,
        workMode: values.workMode || null,
        salaryRange: values.salaryRange || null,
        notes: values.notes || null,
        priority: values.priority || null,
        resumeId: values.resumeId ? Number(values.resumeId) : null,
      };
      const res = await createApplication(payload);
      toast.success("Application created");
      navigate(`/applications/${res.data.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create application");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">New Application</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company</Label>
              <Input id="companyName" placeholder="Acme Corp" {...register("companyName")} />
              {errors.companyName && (
                <p className="text-sm text-destructive">{errors.companyName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleTitle">Role</Label>
              <Input id="roleTitle" placeholder="Software Engineer" {...register("roleTitle")} />
              {errors.roleTitle && (
                <p className="text-sm text-destructive">{errors.roleTitle.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium"
        >
          Additional details
          <ChevronDown className={`size-4 transition-transform ${showMore ? "rotate-180" : ""}`} />
        </button>

        {showMore && (
          <Card>
            <CardContent className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Bangalore, India" {...register("location")} />
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
                  <Label htmlFor="salaryRange">Salary range</Label>
                  <Input id="salaryRange" placeholder="$120k - $150k" {...register("salaryRange")} />
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobUrl">Job posting URL</Label>
                <Input id="jobUrl" placeholder="https://..." {...register("jobUrl")} />
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

              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job description</Label>
                <Textarea
                  id="jobDescription"
                  rows={6}
                  placeholder="Paste the job description here..."
                  {...register("jobDescription")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" rows={3} placeholder="Any personal notes..." {...register("notes")} />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Application"}
          </Button>
        </div>
      </form>
    </div>
  );
}
