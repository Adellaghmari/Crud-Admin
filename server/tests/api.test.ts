import request from "supertest";

vi.mock("bcrypt", () => ({
  default: {
    hash: async (value: string) => `hashed:${value}`,
    compare: async (value: string, hashedValue: string) =>
      hashedValue === value || hashedValue === `hashed:${value}`,
  },
  hash: async (value: string) => `hashed:${value}`,
  compare: async (value: string, hashedValue: string) =>
    hashedValue === value || hashedValue === `hashed:${value}`,
}));

const {
  mockPrisma,
  users,
  customers,
  deals,
  resetData,
} = vi.hoisted(() => {
  type Role = "ADMIN" | "USER";
  type UserRecord = {
    id: string;
    email: string;
    name: string;
    role: Role;
    passwordHash: string;
    createdAt: Date;
  };
  type CustomerRecord = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    status: string;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    deals: unknown[];
  };
  type DealRecord = {
    id: string;
    customerId: string;
    title: string;
    description: string | null;
    priority: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  };

  const usersData: UserRecord[] = [
    {
      id: "cm-admin-001",
      email: "admin@test.dev",
      name: "Admin User",
      role: "ADMIN" as Role,
      passwordHash: "Password123!",
      createdAt: new Date("2026-01-01"),
    },
    {
      id: "cm-user-001",
      email: "user@test.dev",
      name: "Regular User",
      role: "USER" as Role,
      passwordHash: "Password123!",
      createdAt: new Date("2026-01-01"),
    },
  ];

  const customersData: CustomerRecord[] = [
    {
      id: "cmr1111111111111111111111",
      name: "Alice",
      email: "alice@example.com",
      phone: null,
      status: "ACTIVE",
      notes: null,
      createdAt: new Date("2026-01-05"),
      updatedAt: new Date("2026-01-05"),
      deals: [],
    },
  ];

  const dealsData: DealRecord[] = [
    {
      id: "deal1111111111111111111111",
      customerId: "cmr1111111111111111111111",
      title: "Setup",
      description: null,
      priority: "MEDIUM",
      status: "OPEN",
      createdAt: new Date("2026-01-05"),
      updatedAt: new Date("2026-01-05"),
    },
  ];

  const reset = () => {
    usersData.splice(2);
    customersData.splice(1);
    dealsData.splice(1);
  };

  const prismaMock = {
    user: {
      findUnique: vi.fn(async ({ where }: { where: { email?: string; id?: string } }) => {
        if (where.email) {
          return usersData.find((user) => user.email === where.email) ?? null;
        }
        if (where.id) {
          return usersData.find((user) => user.id === where.id) ?? null;
        }
        return null;
      }),
      create: vi.fn(
        async ({
          data,
          select,
        }: {
          data: { email: string; name: string; passwordHash: string; role?: Role };
          select?: Record<string, boolean>;
        }) => {
          const created = {
            id: `cm-user-${usersData.length + 1}`,
            email: data.email,
            name: data.name,
            role: data.role ?? ("USER" as Role),
            passwordHash: data.passwordHash,
            createdAt: new Date(),
          };
          usersData.push(created);

          if (!select) return created;
          return {
            id: created.id,
            email: created.email,
            name: created.name,
            role: created.role,
            createdAt: created.createdAt,
          };
        },
      ),
    },
    customer: {
      findMany: vi.fn(async () =>
        customersData.map((customer) => ({
          ...customer,
          _count: { deals: dealsData.filter((deal) => deal.customerId === customer.id).length },
        })),
      ),
      count: vi.fn(async () => customersData.length),
      findUnique: vi.fn(async ({ where }: { where: { id?: string; email?: string } }) => {
        if (where.id) return customersData.find((customer) => customer.id === where.id) ?? null;
        if (where.email) return customersData.find((customer) => customer.email === where.email) ?? null;
        return null;
      }),
      create: vi.fn(
        async ({
          data,
        }: {
          data: { name: string; email: string; phone: string | null; status: string; notes: string | null };
        }) => {
          const created = {
            id: `cmr${String(customersData.length + 1).padStart(22, "1")}`,
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
            deals: [],
          };
          customersData.push(created);
          return created;
        },
      ),
      update: vi.fn(
        async ({
          where,
          data,
        }: {
          where: { id: string };
          data: { name: string; email: string; phone: string | null; status: string; notes: string | null };
        }) => {
          const index = customersData.findIndex((customer) => customer.id === where.id);
          if (index < 0) throw new Error("Customer not found");
          customersData[index] = { ...customersData[index], ...data, updatedAt: new Date() };
          return customersData[index];
        },
      ),
      delete: vi.fn(async ({ where }: { where: { id: string } }) => {
        const index = customersData.findIndex((customer) => customer.id === where.id);
        if (index >= 0) customersData.splice(index, 1);
        return null;
      }),
    },
    deal: {
      findMany: vi.fn(async () =>
        dealsData.map((deal) => ({
          ...deal,
          customer: customersData.find((customer) => customer.id === deal.customerId) ?? null,
        })),
      ),
      findUnique: vi.fn(async ({ where }: { where: { id: string } }) => {
        return dealsData.find((deal) => deal.id === where.id) ?? null;
      }),
      create: vi.fn(
        async ({
          data,
        }: {
          data: {
            customerId: string;
            title: string;
            description: string | null;
            priority: string;
            status: string;
          };
        }) => {
          const created = {
            id: `deal${String(dealsData.length + 1).padStart(22, "1")}`,
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          dealsData.push(created);
          return created;
        },
      ),
      update: vi.fn(async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
        const index = dealsData.findIndex((deal) => deal.id === where.id);
        if (index < 0) throw new Error("Deal not found");
        dealsData[index] = { ...dealsData[index], ...data, updatedAt: new Date() };
        return dealsData[index];
      }),
      delete: vi.fn(async ({ where }: { where: { id: string } }) => {
        const index = dealsData.findIndex((deal) => deal.id === where.id);
        if (index >= 0) dealsData.splice(index, 1);
        return null;
      }),
    },
  };

  return {
    mockPrisma: prismaMock,
    users: usersData,
    customers: customersData,
    deals: dealsData,
    resetData: reset,
  };
});

vi.mock("../src/config/prisma.js", () => ({
  prisma: mockPrisma,
}));

import { app } from "../src/app.js";

describe("API endpoints", () => {
  beforeEach(() => {
    resetData();
  });

  const loginAs = async (email: string, password = "Password123!") => {
    const response = await request(app).post("/api/auth/login").send({ email, password });
    return response.body.token as string;
  };

  it("GET /api/health returns status ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("GET /api/customers requires auth", async () => {
    const res = await request(app).get("/api/customers");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  it("GET /api/customers returns paginated list for authenticated user", async () => {
    const token = await loginAs("user@test.dev");
    const res = await request(app)
      .get("/api/customers")
      .query({ page: 1, pageSize: 8, sortOrder: "desc" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.pagination).toEqual(
      expect.objectContaining({
        page: 1,
        pageSize: 8,
        total: 1,
        totalPages: 1,
      }),
    );
  });

  it("POST /api/auth/register validates payload", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "invalid-email",
      password: "123",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Validation failed");
    expect(Array.isArray(res.body.issues)).toBe(true);
  });

  it("POST /api/auth/register creates a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "New User",
      email: "new.user@test.dev",
      password: "Password123!",
    });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("new.user@test.dev");
    expect(users.some((user) => user.email === "new.user@test.dev")).toBe(true);
  });

  it("POST /api/auth/login returns token and cookie", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@test.dev",
      password: "Password123!",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(Array.isArray(res.headers["set-cookie"])).toBe(true);
  });

  it("GET /api/auth/me returns current user with valid token", async () => {
    const token = await loginAs("admin@test.dev");
    const res = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("admin@test.dev");
    expect(res.body.user.role).toBe("ADMIN");
  });

  it("POST /api/customers allows ADMIN", async () => {
    const token = await loginAs("admin@test.dev");
    const res = await request(app)
      .post("/api/customers")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Created by Admin",
        email: "admin-created@example.com",
        status: "LEAD",
        phone: "",
        notes: "",
      });

    expect(res.status).toBe(201);
    expect(customers.some((customer) => customer.email === "admin-created@example.com")).toBe(true);
  });

  it("POST /api/customers denies USER role", async () => {
    const token = await loginAs("user@test.dev");
    const res = await request(app)
      .post("/api/customers")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Created by User",
        email: "user-created@example.com",
        status: "LEAD",
      });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Forbidden");
  });

  it("POST /api/deals denies USER role", async () => {
    const token = await loginAs("user@test.dev");
    const res = await request(app)
      .post("/api/deals")
      .set("Authorization", `Bearer ${token}`)
      .send({
        customerId: customers[0].id,
        title: "User cannot do this",
        priority: "HIGH",
        status: "OPEN",
      });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Forbidden");
  });
});
