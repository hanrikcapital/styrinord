export type RequestStatus = "pending" | "approved" | "declined";

export type ApprovedContact = {
  candidate_id: string;
  full_name: string;
  email: string;
  phone: string | null;
};

export const STATUS_LABEL: Record<RequestStatus, string> = {
  pending: "Venter på svar",
  approved: "Godkjent",
  declined: "Avslått",
};

export const STATUS_CLASS: Record<RequestStatus, string> = {
  pending: "bg-amber-50 text-amber-800",
  approved: "bg-emerald-50 text-emerald-800",
  declined: "bg-slate-100 text-slate-600",
};
