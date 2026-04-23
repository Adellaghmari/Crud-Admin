import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Customer, CustomerStatus } from "../types";
import { FormField } from "./form-field";
import { Button, Card, Input, Select } from "./ui";

const customerSchema = z.object({
  name: z.string().min(2, "Namn krävs"),
  email: z.email("Ogiltig e-post"),
  phone: z.string().optional(),
  status: z.enum(["LEAD", "ACTIVE", "INACTIVE"]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof customerSchema>;

type CustomerFormProps = {
  selectedCustomer?: Customer | null;
  isLoading?: boolean;
  onSave: (payload: FormValues) => Promise<void>;
  onCancelEdit: () => void;
};

const statusOptions: { value: CustomerStatus; label: string }[] = [
  { value: "LEAD", label: "Prospekt" },
  { value: "ACTIVE", label: "Aktiv" },
  { value: "INACTIVE", label: "Inaktiv" },
];

export const CustomerForm = ({
  selectedCustomer,
  isLoading,
  onSave,
  onCancelEdit,
}: CustomerFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(customerSchema),
    values: {
      name: selectedCustomer?.name ?? "",
      email: selectedCustomer?.email ?? "",
      phone: selectedCustomer?.phone ?? "",
      status: selectedCustomer?.status ?? "LEAD",
      notes: selectedCustomer?.notes ?? "",
    },
  });

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-900">
        {selectedCustomer ? "Redigera kund" : "Ny kund"}
      </h2>
      <form
        className="mt-4 grid gap-3"
        onSubmit={handleSubmit(async (values) => {
          await onSave(values);
          if (!selectedCustomer) {
            reset();
          }
        })}
      >
        <FormField label="Namn" error={errors.name?.message}>
          <Input {...register("name")} />
        </FormField>
        <FormField label="E-post" error={errors.email?.message}>
          <Input {...register("email")} />
        </FormField>
        <FormField label="Telefon" error={errors.phone?.message}>
          <Input {...register("phone")} />
        </FormField>
        <FormField label="Status" error={errors.status?.message}>
          <Select {...register("status")}>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Anteckningar" error={errors.notes?.message}>
          <Input {...register("notes")} />
        </FormField>
        <div className="flex gap-2">
          <Button disabled={isLoading} type="submit">
            {isLoading ? "Sparar..." : selectedCustomer ? "Uppdatera" : "Skapa kund"}
          </Button>
          {selectedCustomer ? (
            <Button className="bg-slate-200 text-slate-900 hover:bg-slate-300" onClick={onCancelEdit} type="button">
              Avbryt
            </Button>
          ) : null}
        </div>
      </form>
    </Card>
  );
};
