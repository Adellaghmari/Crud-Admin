export const formatDate = (value: string) => {
  return new Date(value).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const customerStatus: Record<string, string> = {
  LEAD: "Prospekt",
  ACTIVE: "Aktiv",
  INACTIVE: "Inaktiv",
};

const dealStatus: Record<string, string> = {
  OPEN: "Öppen",
  IN_PROGRESS: "Pågår",
  WON: "Vunnen",
  LOST: "Förlorad",
};

const dealPriority: Record<string, string> = {
  LOW: "Låg",
  MEDIUM: "Medel",
  HIGH: "Hög",
};

export const customerStatusLabel = (value: string) => customerStatus[value] ?? value;

export const dealStatusLabel = (value: string) => dealStatus[value] ?? value;

export const dealPriorityLabel = (value: string) => dealPriority[value] ?? value;
