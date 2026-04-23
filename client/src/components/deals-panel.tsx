import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Customer, Deal } from "../types";
import { readOnlyLabel } from "../locale-sv";
import { dealPriorityLabel, dealStatusLabel, formatDate } from "../utils/format";
import { useDealMutations } from "../hooks/use-deals";
import { Button, Card, Input, Select } from "./ui";
import { FormField } from "./form-field";

type DealForm = {
  customerId: string;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "IN_PROGRESS" | "WON" | "LOST";
};

type DealsPanelProps = {
  deals: Deal[];
  customers: Customer[];
  canManage: boolean;
};

export const DealsPanel = ({ deals, customers, canManage }: DealsPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { createMutation, deleteMutation } = useDealMutations();
  const { register, handleSubmit, reset } = useForm<DealForm>({
    defaultValues: {
      customerId: "",
      title: "",
      description: "",
      priority: "MEDIUM",
      status: "OPEN",
    },
  });

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Ärenden</h2>
        {canManage ? (
          <Button onClick={() => setIsOpen((current) => !current)}>
            {isOpen ? "Stäng formulär" : "Nytt ärende"}
          </Button>
        ) : (
          <span className="text-xs font-medium text-slate-500">{readOnlyLabel}</span>
        )}
      </div>

      {isOpen && canManage ? (
        <form
          className="mb-5 grid gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-2"
          onSubmit={handleSubmit(async (values) => {
            await createMutation.mutateAsync(values);
            reset();
            setIsOpen(false);
          })}
        >
          <FormField label="Kund">
            <Select {...register("customerId")}>
              <option value="">Välj kund</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Titel">
            <Input {...register("title")} />
          </FormField>
          <FormField label="Prioritet">
            <Select {...register("priority")}>
              <option value="LOW">Låg</option>
              <option value="MEDIUM">Medel</option>
              <option value="HIGH">Hög</option>
            </Select>
          </FormField>
          <FormField label="Status">
            <Select {...register("status")}>
              <option value="OPEN">Öppen</option>
              <option value="IN_PROGRESS">Pågår</option>
              <option value="WON">Vunnen</option>
              <option value="LOST">Förlorad</option>
            </Select>
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Beskrivning">
              <Input {...register("description")} />
            </FormField>
          </div>
          <div className="md:col-span-2">
            <Button disabled={createMutation.isPending} type="submit">
              {createMutation.isPending ? "Sparar..." : "Skapa ärende"}
            </Button>
          </div>
        </form>
      ) : null}

      {deals.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          Inga ärenden ännu.
        </div>
      ) : (
        <div className="space-y-3">
          {deals.map((deal) => (
            <div className="rounded-xl border border-slate-200 p-4" key={deal.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{deal.title}</h3>
                  <p className="text-sm text-slate-500">
                    {deal.customer?.name ?? "Okänd kund"} • {dealPriorityLabel(deal.priority)} •{" "}
                    {dealStatusLabel(deal.status)} • {formatDate(deal.createdAt)}
                  </p>
                </div>
                {canManage ? (
                  <Button
                    className="bg-rose-600 hover:bg-rose-500"
                    onClick={async () => {
                      await deleteMutation.mutateAsync(deal.id);
                    }}
                  >
                    Ta bort
                  </Button>
                ) : null}
              </div>
              {deal.description ? <p className="mt-2 text-sm text-slate-700">{deal.description}</p> : null}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
