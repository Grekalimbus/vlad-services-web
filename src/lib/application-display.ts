export type ApplicationForm = "book" | "signup" | "tv";

export const FORM_TAB_LABELS: Record<ApplicationForm, string> = {
  book: "Book now",
  signup: "Sign up",
  tv: "TV",
};

export const FORM_ID_LABELS: Record<string, string> = {
  "quote-dialog": "Hire a PRO",
  "general-quote": "Hire a PRO",
  "deals-quote": "Hire a PRO (Deals)",
  "deals-page": "Hire a PRO (Deals)",
  "deals-signup": "Deals signup",
  "deals-popup": "Signup popup",
  "tv-quiz": "TV quiz",
  "tv-discount": "TV discount",
};

/** Contact / source / meta keys handled in dedicated modal sections. */
export const CONTACT_DETAIL_KEYS = new Set(["name", "phone", "email", "zip", "service"]);

export const SOURCE_DETAIL_KEYS = new Set([
  "formId",
  "formLocation",
  "sourcePage",
  "leadSource",
  "hearAbout",
]);

export const DETAIL_LABELS: Record<string, string> = {
  hearAbout: "Heard about",
  description: "Description",
  tvCount: "TVs",
  offer: "Offer",
  dealOffer: "Deal",
  leadSource: "Lead source",
  sourcePage: "Source page",
  formId: "Form",
  formLocation: "Form location",
  room: "Room",
  mount: "Mount",
  wall: "Wall",
  size: "Size",
  tvSize: "Size",
  wallType: "Wall",
  hasMount: "Has mount",
  mountType: "Mount",
  concealment: "Cables",
};

export function formatTvCount(value: string): string {
  const trimmed = value.trim();
  if (trimmed === "1") return "1 TV";
  if (trimmed === "2") return "2 TVs";
  if (trimmed === "3") return "3 TVs";
  if (trimmed === "4plus" || trimmed === "4+") return "4+ TVs";
  return trimmed;
}

export function formIdLabel(formId: string | undefined): string | null {
  if (!formId) return null;
  return FORM_ID_LABELS[formId] ?? formId;
}

export function detailLabel(key: string, quizStepLabels: Record<string, string> = {}): string {
  if (DETAIL_LABELS[key]) return DETAIL_LABELS[key];
  if (quizStepLabels[key]) return quizStepLabels[key];
  return key;
}

export function formatDetailValue(key: string, value: string): string {
  if (key === "tvCount") return formatTvCount(value);
  if (key === "formId") return formIdLabel(value) ?? value;
  return value;
}

export function partitionDetails(
  details: Record<string, string>,
  service: string,
  quizStepLabels: Record<string, string> = {},
  form?: ApplicationForm,
) {
  const request: { key: string; label: string; value: string }[] = [];
  const source: { key: string; label: string; value: string }[] = [];
  const quiz: { key: string; label: string; value: string }[] = [];

  for (const [key, raw] of Object.entries(details)) {
    if (!raw || CONTACT_DETAIL_KEYS.has(key)) continue;
    if (raw === service && key !== "offer" && key !== "dealOffer") continue;
    const label = detailLabel(key, quizStepLabels);
    const value = formatDetailValue(key, raw);
    const entry = { key, label, value };
    if (SOURCE_DETAIL_KEYS.has(key)) {
      source.push(entry);
      continue;
    }
    const knownRequest = key in DETAIL_LABELS;
    if (quizStepLabels[key] || (form === "tv" && !knownRequest)) {
      quiz.push(entry);
      continue;
    }
    request.push(entry);
  }

  return { request, source, quiz };
}
