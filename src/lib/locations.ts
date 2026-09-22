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

export const locations: ServiceLocation[] = [
  {
    id: "california",
    city: "California",
    region: "CA",
    country: "US",
    label: "California",
    shortLabel: "California",
    status: "active",
  },
  // Add future markets here, e.g. Los Angeles, without showing them until status is "active".
];

export const activeLocations = locations.filter(
  (location) => location.status === "active",
);

export const primaryLocation =
  activeLocations[0] ??
  locations.find((location) => location.id === "california")!;
