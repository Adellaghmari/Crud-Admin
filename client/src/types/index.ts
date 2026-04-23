export type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
};

export type CustomerStatus = "LEAD" | "ACTIVE" | "INACTIVE";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: CustomerStatus;
  notes: string | null;
  createdAt: string;
  _count?: { deals: number };
};

export type DealStatus = "OPEN" | "IN_PROGRESS" | "WON" | "LOST";
export type DealPriority = "LOW" | "MEDIUM" | "HIGH";

export type Deal = {
  id: string;
  customerId: string;
  title: string;
  description: string | null;
  priority: DealPriority;
  status: DealStatus;
  createdAt: string;
  customer?: Pick<Customer, "id" | "name" | "email">;
};

export type PaginatedCustomers = {
  items: Customer[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};
