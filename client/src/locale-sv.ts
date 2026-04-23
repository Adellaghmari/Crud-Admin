export const appName = "Kundadmin";

export const roleLabel = (role: string) =>
  role === "ADMIN" ? "Admin" : role === "USER" ? "Användare" : role;

export const readOnlyLabel = "Endast läsning";
