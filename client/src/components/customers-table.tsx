import { readOnlyLabel } from "../locale-sv";
import type { Customer, CustomerStatus } from "../types";
import { customerStatusLabel, formatDate } from "../utils/format";
import { Button, Card, Input, Select } from "./ui";

type CustomersTableProps = {
  customers: Customer[];
  canManage: boolean;
  search: string;
  status: CustomerStatus | "ALL";
  sortOrder: "asc" | "desc";
  page: number;
  totalPages: number;
  onSearch: (value: string) => void;
  onStatus: (value: CustomerStatus | "ALL") => void;
  onSort: (value: "asc" | "desc") => void;
  onPage: (value: number) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
};

export const CustomersTable = ({
  customers,
  canManage,
  search,
  status,
  sortOrder,
  page,
  totalPages,
  onSearch,
  onStatus,
  onSort,
  onPage,
  onEdit,
  onDelete,
}: CustomersTableProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <Input
          placeholder="Sök namn eller e-post..."
          value={search}
          onChange={(event) => onSearch(event.target.value)}
        />
        <Select value={status} onChange={(event) => onStatus(event.target.value as CustomerStatus | "ALL")}>
          <option value="ALL">Alla statusar</option>
          <option value="LEAD">Prospekt</option>
          <option value="ACTIVE">Aktiv</option>
          <option value="INACTIVE">Inaktiv</option>
        </Select>
        <Select value={sortOrder} onChange={(event) => onSort(event.target.value as "asc" | "desc")}>
          <option value="desc">Nyast först</option>
          <option value="asc">Äldst först</option>
        </Select>
      </div>

      {customers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
          Inga kunder hittades med nuvarande filter.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="py-2 pr-3">Namn</th>
                <th className="py-2 pr-3">E-post</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Skapad</th>
                <th className="py-2 text-right">{canManage ? "Åtgärder" : "Behörighet"}</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr className="border-b border-slate-100" key={customer.id}>
                  <td className="py-3 pr-3 font-medium text-slate-900">{customer.name}</td>
                  <td className="py-3 pr-3 text-slate-700">{customer.email}</td>
                  <td className="py-3 pr-3 text-slate-700">{customerStatusLabel(customer.status)}</td>
                  <td className="py-3 pr-3 text-slate-700">{formatDate(customer.createdAt)}</td>
                  <td className="py-3 text-right">
                    {canManage ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          className="bg-slate-200 text-slate-900 hover:bg-slate-300"
                          onClick={() => onEdit(customer)}
                        >
                          Redigera
                        </Button>
                        <Button className="bg-rose-600 hover:bg-rose-500" onClick={() => onDelete(customer)}>
                          Ta bort
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">{readOnlyLabel}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-slate-500">
          Sida {page} av {totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            className="bg-slate-200 text-slate-900 hover:bg-slate-300"
            disabled={page <= 1}
            onClick={() => onPage(page - 1)}
          >
            Föregående
          </Button>
          <Button disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
            Nästa
          </Button>
        </div>
      </div>
    </Card>
  );
};
