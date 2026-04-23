import type { PropsWithChildren } from "react";

export const FormField = ({
  label,
  error,
  children,
}: PropsWithChildren<{ label: string; error?: string }>) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    {children}
    {error ? <span className="text-xs text-rose-600">{error}</span> : null}
  </label>
);
