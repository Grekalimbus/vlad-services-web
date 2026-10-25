import { live, readCms } from "@/lib/cms/read";

export type LocationStatus = "active" | "planned";

export type ServiceLocation = {
  id: string;
  city: string;
  region: string;
  country: "US";
  label: string;
  shortLabel: string;
  status: LocationStatus;
};

export const locations = live(() => readCms().locations as ServiceLocation[]);
