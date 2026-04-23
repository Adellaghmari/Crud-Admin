import clsx from "clsx";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  PropsWithChildren,
  SelectHTMLAttributes,
} from "react";

export const Card = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <div className={clsx("rounded-2xl border border-slate-200 bg-white p-5 shadow-sm", className)}>
    {children}
  </div>
);

export const Button = ({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={clsx(
      "rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
      "bg-slate-900 text-white hover:bg-slate-700",
      className,
    )}
    {...props}
  />
);

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={clsx(
      "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none",
      "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100",
      className,
    )}
    {...props}
  />
);

export const Select = ({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={clsx(
      "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none",
      "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100",
      className,
    )}
    {...props}
  />
);
