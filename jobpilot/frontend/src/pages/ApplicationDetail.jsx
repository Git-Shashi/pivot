import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Pencil, Trash2, ExternalLink, FileText } from "lucide-react";
import {
  getApplication,
  updateApplicationStatus,
  deleteApplication,
} from "@/api/applications";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PriorityBadge } from "@/components/StatusBadge";
import EditApplicationDialog from "@/components/application/EditApplicationDialog";
import RoundsTab from "@/components/application/RoundsTab";
import ContactsTab from "@/components/application/ContactsTab";
import TodosTab from "@/components/application/TodosTab";
import CoverLetterTab from "@/components/application/CoverLetterTab";
import { STATUS_OPTIONS, WORK_MODE_LABELS } from "@/lib/constants";

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getApplication(id)
      .then((res) => {
        if (!cancelled) setApplication(res.data.data);
      })
      .catch(() => {
        if (!cancelled) toast.error("Could not load application");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleStatusChange = async (status) => {
    try {
      const res = await updateApplicationStatus(id, status);
      setApplication(res.data.data);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteApplication(id);
      toast.success("Application deleted");
      navigate("/");
    } catch {
      toast.error("Could not delete application");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Card>
          <CardContent className="space-y-4">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-6 w-32" />
          </CardContent>
        </Card>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!application) {
    return <div className="py-12 text-center text-muted-foreground">Application not found.</div>;
  }

  const meta = [
    application.location,
    application.workMode ? WORK_MODE_LABELS[application.workMode] : null,
    application.salaryRange,
    application.appliedDate ? `Applied ${application.appliedDate}` : null,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
        <ArrowLeft className="size-4" />
        Back to dashboard
      </Button>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{application.roleTitle}</h1>
              <p className="text-muted-foreground">{application.companyName}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                <Pencil className="size-4" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="size-4" />
                Delete
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={application.status} onValueChange={handleStatusChange}>
              <SelectTrigger size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <PriorityBadge priority={application.priority} />
            {application.jobUrl && (
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <ExternalLink className="size-3.5" />
                Job posting
              </a>
            )}
            {application.resumeInfo?.resume && (
              <Link
                to="/profile"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <FileText className="size-3.5" />
                {application.resumeInfo.resume.label}
              </Link>
            )}
          </div>

          {meta.length > 0 && (
            <p className="text-sm text-muted-foreground">{meta.join(" · ")}</p>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rounds">Rounds ({application.rounds.length})</TabsTrigger>
          <TabsTrigger value="contacts">Contacts ({application.contacts.length})</TabsTrigger>
          <TabsTrigger value="todos">Todos ({application.todos.length})</TabsTrigger>
          <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          {application.jobDescription ? (
            <div>
              <h3 className="mb-2 font-medium">Job description</h3>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {application.jobDescription}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No job description added.</p>
          )}
          {application.notes && (
            <div>
              <h3 className="mb-2 font-medium">Notes</h3>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {application.notes}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="rounds" className="pt-4">
          <RoundsTab
            appId={application.id}
            rounds={application.rounds}
            onChange={(updater) =>
              setApplication((prev) => ({ ...prev, rounds: updater(prev.rounds) }))
            }
          />
        </TabsContent>

        <TabsContent value="contacts" className="pt-4">
          <ContactsTab
            appId={application.id}
            contacts={application.contacts}
            onChange={(updater) =>
              setApplication((prev) => ({ ...prev, contacts: updater(prev.contacts) }))
            }
          />
        </TabsContent>

        <TabsContent value="todos" className="pt-4">
          <TodosTab
            appId={application.id}
            todos={application.todos}
            onChange={(updater) =>
              setApplication((prev) => ({ ...prev, todos: updater(prev.todos) }))
            }
          />
        </TabsContent>

        <TabsContent value="cover-letter" className="pt-4">
          <CoverLetterTab
            appId={application.id}
            coverLetter={application.coverLetter}
            onChange={(coverLetter) => setApplication((prev) => ({ ...prev, coverLetter }))}
          />
        </TabsContent>
      </Tabs>

      <EditApplicationDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        application={application}
        onSaved={setApplication}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete application?</DialogTitle>
            <DialogDescription>
              This will permanently delete this application and all its rounds, contacts, and
              tasks. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
