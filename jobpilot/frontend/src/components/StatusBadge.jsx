import { cn } from "@/lib/utils";
import {
  STATUS_COLORS,
  STATUS_LABELS,
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  ROUND_RESULT_COLORS,
  ROUND_RESULT_LABELS,
} from "@/lib/constants";

export function StatusBadge({ status, className }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 w-fit shrink-0 items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        STATUS_COLORS[status],
        className
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function PriorityBadge({ priority, className }) {
  if (!priority) return null;
  return (
    <span
      className={cn(
        "inline-flex h-5 w-fit shrink-0 items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        PRIORITY_COLORS[priority],
        className
      )}
    >
      {PRIORITY_LABELS[priority] ?? priority}
    </span>
  );
}

export function RoundResultBadge({ result, className }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 w-fit shrink-0 items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        ROUND_RESULT_COLORS[result],
        className
      )}
    >
      {ROUND_RESULT_LABELS[result] ?? result}
    </span>
  );
}
