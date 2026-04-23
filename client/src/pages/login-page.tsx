import { Link, useNavigate } from "react-router-dom";
import { AuthForm } from "../components/auth-form";
import { useAuth } from "../hooks/use-auth";
import { useState } from "react";
import { getApiErrorMessage } from "../utils/api-error";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-4">
        <AuthForm
          type="login"
          onSubmit={async (values) => {
            setError(null);
            try {
              await login({ email: values.email, password: values.password });
              navigate("/");
            } catch (caught) {
              setError(getApiErrorMessage(caught, "Kunde inte logga in. Kontrollera dina uppgifter."));
            }
          }}
        />
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <p className="text-center text-sm text-slate-600">
          Saknar konto?{" "}
          <Link className="font-semibold text-indigo-600 hover:text-indigo-500" to="/register">
            Registrera
          </Link>
        </p>
      </div>
    </div>
  );
};
