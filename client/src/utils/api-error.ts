import { isAxiosError } from "axios";

const apiMessageToSv: Record<string, string> = {
  "Internal server error": "Ett serverfel uppstod. Försök igen om en stund.",
  Unauthorized: "Sessionen kunde inte verifieras. Logga in igen.",
  Forbidden: "Du har inte behörighet att göra det.",
  "Validation failed": "Fälten innehöll fel. Kontrollera innehållet.",
};

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError(error) && !error.response) {
    return "Nätverksfel. Kolla uppkoppling och VITE_API_URL (ofta …/api).";
  }
  if (isAxiosError(error) && error.response?.data) {
    const data = error.response.data as { message?: string; issues?: { message: string }[] };
    if (typeof data.message === "string" && data.message) {
      return apiMessageToSv[data.message] ?? data.message;
    }
    if (Array.isArray(data.issues) && data.issues.length > 0) {
      return data.issues.map((i) => i.message).filter(Boolean).join(" ");
    }
  }
  return fallback;
};
