export const STATUS_OPTIONS = [
  { value: "BOOKMARKED", label: "Bookmarked" },
  { value: "APPLIED", label: "Applied" },
  { value: "OA", label: "Online Assessment" },
  { value: "INTERVIEWING", label: "Interviewing" },
  { value: "OFFERED", label: "Offered" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "REJECTED", label: "Rejected" },
  { value: "GHOSTED", label: "Ghosted" },
  { value: "WITHDRAWN", label: "Withdrawn" },
];

export const STATUS_LABELS = Object.fromEntries(
  STATUS_OPTIONS.map((o) => [o.value, o.label])
);

export const STATUS_COLORS = {
  BOOKMARKED: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
  APPLIED: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  OA: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
  INTERVIEWING: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  OFFERED: "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300",
  ACCEPTED: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  GHOSTED: "bg-zinc-100 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-300",
  WITHDRAWN: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
};

export const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

export const PRIORITY_LABELS = Object.fromEntries(
  PRIORITY_OPTIONS.map((o) => [o.value, o.label])
);

export const PRIORITY_COLORS = {
  LOW: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
  MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  HIGH: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

export const WORK_MODE_OPTIONS = [
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ONSITE", label: "Onsite" },
];

export const WORK_MODE_LABELS = Object.fromEntries(
  WORK_MODE_OPTIONS.map((o) => [o.value, o.label])
);

export const ROUND_TYPE_OPTIONS = [
  { value: "OA", label: "Online Assessment" },
  { value: "PHONE_SCREEN", label: "Phone Screen" },
  { value: "TECHNICAL", label: "Technical" },
  { value: "SYSTEM_DESIGN", label: "System Design" },
  { value: "BEHAVIORAL", label: "Behavioral" },
  { value: "HR", label: "HR" },
  { value: "TAKE_HOME", label: "Take Home" },
  { value: "ONSITE", label: "Onsite" },
  { value: "BAR_RAISER", label: "Bar Raiser" },
  { value: "OTHER", label: "Other" },
];

export const ROUND_TYPE_LABELS = Object.fromEntries(
  ROUND_TYPE_OPTIONS.map((o) => [o.value, o.label])
);

export const ROUND_RESULT_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "PASSED", label: "Passed" },
  { value: "FAILED", label: "Failed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const ROUND_RESULT_LABELS = Object.fromEntries(
  ROUND_RESULT_OPTIONS.map((o) => [o.value, o.label])
);

export const ROUND_RESULT_COLORS = {
  PENDING: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
  PASSED: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
  FAILED: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  CANCELLED: "bg-zinc-100 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-300",
};

export const COVER_LETTER_TONES = [
  { value: "professional", label: "Professional" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "concise", label: "Concise" },
  { value: "formal", label: "Formal" },
];
