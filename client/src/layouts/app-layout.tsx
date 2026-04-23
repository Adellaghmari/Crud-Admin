import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import { Button } from "../components/ui";
import { appName, roleLabel } from "../locale-sv";

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link className="text-lg font-bold text-slate-900" to="/">
              {appName}
            </Link>
            <Link className="text-sm text-slate-600 hover:text-slate-900" to="/">
              Översikt
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              {roleLabel(user?.role ?? "USER")}
            </span>
            <span className="text-sm text-slate-500">{user?.email}</span>
            <Button
              className="bg-slate-200 text-slate-900 hover:bg-slate-300"
              onClick={async () => {
                await logout();
                navigate("/login");
              }}
            >
              Logga ut
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};
