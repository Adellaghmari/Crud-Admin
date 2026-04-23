import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "./form-field";
import { Button, Card, Input } from "./ui";

const loginSchema = z.object({
  email: z.email("Ogiltig e-post"),
  password: z.string().min(8, "Lösenord måste vara minst 8 tecken"),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Namn måste vara minst 2 tecken"),
});

type FormValues = {
  name?: string;
  email: string;
  password: string;
};

type AuthFormProps = {
  type: "login" | "register";
  isLoading?: boolean;
  onSubmit: (values: Required<FormValues>) => Promise<void>;
};

export const AuthForm = ({ type, isLoading, onSubmit }: AuthFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(type === "login" ? loginSchema : registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  return (
    <Card className="mx-auto w-full max-w-md">
      <h1 className="text-2xl font-bold text-slate-900">
        {type === "login" ? "Logga in" : "Skapa konto"}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {type === "login"
          ? "Fortsätt till kundadministrationen."
          : "Registrera en användare för att börja hantera kunder och ärenden."}
      </p>

      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={handleSubmit(async (values) => {
          await onSubmit({
            name: values.name ?? "",
            email: values.email,
            password: values.password,
          });
        })}
      >
        {type === "register" ? (
          <FormField label="Namn" error={errors.name?.message}>
            <Input placeholder="Anna Andersson" {...register("name")} />
          </FormField>
        ) : null}

        <FormField label="E-post" error={errors.email?.message}>
          <Input placeholder="anna@example.com" {...register("email")} />
        </FormField>

        <FormField label="Lösenord" error={errors.password?.message}>
          <Input type="password" placeholder="Minst 8 tecken" {...register("password")} />
        </FormField>

        <Button disabled={isLoading} type="submit">
          {isLoading ? "Arbetar..." : type === "login" ? "Logga in" : "Skapa konto"}
        </Button>
      </form>
    </Card>
  );
};
