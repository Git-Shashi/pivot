import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Trash2, Search, LayoutGrid, List, Briefcase } from "lucide-react";
import { listApplications, updateApplicationStatus, deleteApplication } from "@/api/applications";
import { getDashboardStats } from "@/api/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
import { StatusBadge, PriorityBadge } from "@/components/StatusBadge";
import KanbanBoard from "@/components/KanbanBoard";
import { STATUS_OPTIONS } from "@/lib/constants";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [view, setView] = useState("kanban");

  useEffect(() => {
    let cancelled = false;
    const params = {};
    if (statusFilter !== "ALL") params.status = statusFilter;
    if (search) params.search = search;

    Promise.all([getDashboardStats(), listApplications(params)])
      .then(([statsRes, appsRes]) => {
        if (!cancelled) {
          setStats(statsRes.data.data);
          setApplications(appsRes.data.data);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [statusFilter, search]);

  const handleStatusChange = async (id, status) => {
    const previous = applications;
    setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status } : app)));
    try {
      await updateApplicationStatus(id, status);
      const statsRes = await getDashboardStats();
      setStats(statsRes.data.data);
    } catch {
      setApplications(previous);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteApplication(deleteTarget.id);
      setApplications((prev) => prev.filter((app) => app.id !== deleteTarget.id));
      toast.success("Application deleted");
      const statsRes = await getDashboardStats();
      setStats(statsRes.data.data);
    } catch {
      toast.error("Failed to delete application");
    } finally {
      setDeleteTarget(null);
    }
  };

  const hasFilters = search.trim() !== "" || statusFilter !== "ALL";

  return (
    <div className="space-y-6 pb-16 sm:pb-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button render={<Link to="/applications/new" />} className="hidden sm:inline-flex">
          <Plus className="size-4" />
          New Application
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-normal text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {loading ? <Skeleton className="h-8 w-10" /> : stats?.total ?? 0}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-normal text-muted-foreground">This Week</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {loading ? <Skeleton className="h-8 w-10" /> : stats?.thisWeek ?? 0}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-normal text-muted-foreground">Response Rate</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {loading ? (
              <Skeleton className="h-8 w-14" />
            ) : (
              `${(stats.responseRate * 100).toFixed(0)}%`
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-normal text-muted-foreground">Interviewing</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {loading ? <Skeleton className="h-8 w-10" /> : stats?.byStatus?.INTERVIEWING ?? 0}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <Button
            variant={view === "kanban" ? "default" : "ghost"}
            size="icon-sm"
            onClick={() => setView("kanban")}
            title="Kanban view"
          >
            <LayoutGrid className="size-4" />
          </Button>
          <Button
            variant={view === "table" ? "default" : "ghost"}
            size="icon-sm"
            onClick={() => setView("table")}
            title="Table view"
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-64 shrink-0 space-y-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Briefcase className="size-10 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {hasFilters ? "No applications match your filters" : "No applications yet"}
              </p>
              <p className="text-sm text-muted-foreground">
                {hasFilters
                  ? "Try adjusting your search or status filter."
                  : "Start tracking your job search by adding your first application."}
              </p>
            </div>
            {!hasFilters && (
              <Button render={<Link to="/applications/new" />}>
                <Plus className="size-4" />
                New Application
              </Button>
            )}
          </CardContent>
        </Card>
      ) : view === "kanban" ? (
        <KanbanBoard applications={applications} onStatusChange={handleStatusChange} />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Applied</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">
                      <Link to={`/applications/${app.id}`} className="hover:underline">
                        {app.companyName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{app.roleTitle}</td>
                    <td className="px-4 py-3">
                      <Select
                        value={app.status}
                        onValueChange={(value) => handleStatusChange(app.id, value)}
                      >
                        <SelectTrigger size="sm" className="h-7 border-none bg-transparent px-1 shadow-none">
                          <StatusBadge status={app.status} />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={app.priority} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{app.location || "–"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {app.appliedDate ?? "–"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteTarget(app)}
                        aria-label="Delete application"
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Button
        render={<Link to="/applications/new" />}
        size="icon-lg"
        className="fixed bottom-6 right-6 rounded-full shadow-lg sm:hidden"
        aria-label="New application"
      >
        <Plus className="size-5" />
      </Button>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete application?</DialogTitle>
            <DialogDescription>
              This will permanently delete the application for{" "}
              <span className="font-medium">{deleteTarget?.roleTitle}</span> at{" "}
              <span className="font-medium">{deleteTarget?.companyName}</span>. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
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
