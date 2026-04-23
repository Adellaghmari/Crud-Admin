import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthForm } from "../components/auth-form";
import { useAuth } from "../hooks/use-auth";
import { getApiErrorMessage } from "../utils/api-error";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-4">
        <AuthForm
          type="register"
          onSubmit={async (values) => {
            setError(null);
            try {
              await register(values);
              navigate("/login");
            } catch (caught) {
              setError(getApiErrorMessage(caught, "Kunde inte registrera användaren."));
            }
          }}
        />
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <p className="text-center text-sm text-slate-600">
          Har redan konto?{" "}
          <Link className="font-semibold text-indigo-600 hover:text-indigo-500" to="/login">
            Logga in
          </Link>
        </p>
      </div>
    </div>
  );
};
