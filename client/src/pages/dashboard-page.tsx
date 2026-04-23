import { useState } from "react";
import type { Customer, CustomerStatus } from "../types";
import { CustomerForm } from "../components/customer-form";
import { CustomersTable } from "../components/customers-table";
import { ConfirmDialog } from "../components/confirm-dialog";
import { useCustomerMutations, useCustomers } from "../hooks/use-customers";
import { useDeals } from "../hooks/use-deals";
import { DealsPanel } from "../components/deals-panel";
import { useAuth } from "../hooks/use-auth";
import { roleLabel } from "../locale-sv";
import { getApiErrorMessage } from "../utils/api-error";

const PAGE_SIZE = 8;

export const DashboardPage = () => {
  const { user } = useAuth();
  const canManage = user?.role === "ADMIN";

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CustomerStatus | "ALL">("ALL");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Customer | null>(null);

  const customersQuery = useCustomers({
    page,
    pageSize: PAGE_SIZE,
    search,
    status,
    sortOrder,
  });
  const dealsQuery = useDeals();
  const { createMutation, updateMutation, deleteMutation } = useCustomerMutations();

  const customers = customersQuery.data?.items ?? [];
  const totalPages = customersQuery.data?.pagination.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Översikt</h1>
        <p className="mt-1 text-sm text-slate-500">
          Hantera kunder och ärenden på ett ställe.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,1.5fr]">
        {canManage ? (
          <CustomerForm
            isLoading={createMutation.isPending || updateMutation.isPending}
            onCancelEdit={() => setSelectedCustomer(null)}
            onSave={async (payload) => {
              if (selectedCustomer) {
                await updateMutation.mutateAsync({ id: selectedCustomer.id, payload });
                setSelectedCustomer(null);
                return;
              }
              await createMutation.mutateAsync(payload);
            }}
            selectedCustomer={selectedCustomer}
          />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            Ditt konto har rollen <span className="font-semibold">{roleLabel(user?.role ?? "USER")}</span>. Endast
            admin kan skapa, uppdatera och ta bort kunder.
          </div>
        )}

        {customersQuery.isLoading ? (
          <div className="grid place-items-center rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">
            Laddar kunder...
          </div>
        ) : customersQuery.isError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
            {getApiErrorMessage(
              customersQuery.error,
              "Kunde inte hämta kunder. Kontrollera backend och försök igen.",
            )}
          </div>
        ) : (
          <CustomersTable
            canManage={canManage}
            customers={customers}
            onDelete={setDeleteCandidate}
            onEdit={setSelectedCustomer}
            onPage={setPage}
            onSearch={(value) => {
              setPage(1);
              setSearch(value);
            }}
            onSort={setSortOrder}
            onStatus={(value) => {
              setPage(1);
              setStatus(value);
            }}
            page={page}
            search={search}
            sortOrder={sortOrder}
            status={status}
            totalPages={totalPages}
          />
        )}
      </div>

      {dealsQuery.isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">Laddar ärenden…</div>
      ) : dealsQuery.isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          Kunde inte hämta ärenden.
        </div>
      ) : (
        <DealsPanel canManage={canManage} customers={customers} deals={dealsQuery.data ?? []} />
      )}

      {canManage && deleteCandidate ? (
        <ConfirmDialog
          message={`Detta går inte att ångra för ${deleteCandidate.name}.`}
          onCancel={() => setDeleteCandidate(null)}
          onConfirm={async () => {
            await deleteMutation.mutateAsync(deleteCandidate.id);
          }}
          title="Bekräfta borttagning"
        />
      ) : null}
    </div>
  );
};
