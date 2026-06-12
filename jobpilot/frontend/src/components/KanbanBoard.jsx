import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import { CalendarClock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge, PriorityBadge } from "@/components/StatusBadge";
import { KANBAN_COLUMNS } from "@/lib/constants";
import { cn } from "@/lib/utils";

function daysSince(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function ApplicationCard({ app, index }) {
  const days = daysSince(app.appliedDate);

  return (
    <Draggable draggableId={String(app.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(snapshot.isDragging && "opacity-90")}
        >
          <Link to={`/applications/${app.id}`}>
            <Card className="gap-2 p-3 transition-shadow hover:shadow-md">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-tight">{app.roleTitle}</p>
                <p className="text-xs text-muted-foreground">{app.companyName}</p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <StatusBadge status={app.status} />
                <PriorityBadge priority={app.priority} />
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                {days !== null && <p>{days === 0 ? "Applied today" : `${days}d since applied`}</p>}
                {app.nextRoundAt && (
                  <p className="flex items-center gap-1">
                    <CalendarClock className="size-3" />
                    Next round {new Date(app.nextRoundAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </Card>
          </Link>
        </div>
      )}
    </Draggable>
  );
}

export default function KanbanBoard({ applications, onStatusChange }) {
  const grouped = KANBAN_COLUMNS.map((column) => ({
    ...column,
    apps: applications.filter((app) => column.statuses.includes(app.status)),
  }));

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const column = KANBAN_COLUMNS.find((c) => c.id === destination.droppableId);
    onStatusChange(Number(draggableId), column.dropStatus);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {grouped.map((column) => (
          <div key={column.id} className="flex w-64 shrink-0 flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-medium">{column.title}</h3>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {column.apps.length}
              </span>
            </div>
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "flex min-h-24 flex-1 flex-col gap-2 rounded-lg p-2 transition-colors",
                    snapshot.isDraggingOver ? "bg-accent" : "bg-muted/40"
                  )}
                >
                  {column.apps.map((app, index) => (
                    <ApplicationCard key={app.id} app={app} index={index} />
                  ))}
                  {provided.placeholder}
                  {column.apps.length === 0 && (
                    <p className="px-1 py-2 text-center text-xs text-muted-foreground">
                      No applications
                    </p>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
