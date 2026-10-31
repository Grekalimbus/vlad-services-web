import { buildConsentRecord, type ConsentRecord } from "@/lib/consent";

export type LeadFormId =
  | "general-quote"
  | "tv-mounting-quote"
  | "tv-discount"
  | "tv-quiz"
  | "quote-dialog"
  | "deals-signup";

export type LeadType = "quote" | "tv-mounting" | "deals";

export type LeadPhotoMeta = {
  name: string;
  type: string;
  size: number;
};

export type LeadPayload = {
  id: string;
  type: LeadType;
  submittedAt: string;
  source: {
    path: string;
    href: string;
    formId: LeadFormId;
  };
  fields: Record<string, string>;
  photos: LeadPhotoMeta[];
  consents: {
    sms: ConsentRecord;
    email: ConsentRecord;
  };
};

export const quoteSuccessMessage =
  "Thank you! PrimeFix will contact you shortly with availability and pricing.";

function photoMeta(files: File[]) {
  return files.map((file) => ({
    name: file.name,
    type: file.type,
    size: file.size,
  }));
}

export function filesFromFormData(data: FormData, field: string) {
  return data
    .getAll(field)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

export function buildLeadPayload(input: {
  type: LeadType;
  formId: LeadFormId;
  fields: Record<string, string>;
  photos: File[];
  smsConsent: boolean;
  emailConsent: boolean;
  sourcePath?: string;
  href?: string;
}): LeadPayload {
  const sourcePath =
    input.sourcePath ??
    (typeof window !== "undefined" ? window.location.pathname : "/");
  const href =
    input.href ?? (typeof window !== "undefined" ? window.location.href : "");
  const phone = input.fields.phone ?? "";
  const email = input.fields.email ?? "";

  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `lead-${Date.now()}`,
    type: input.type,
    submittedAt: new Date().toISOString(),
    source: {
      path: sourcePath,
      href,
      formId: input.formId,
    },
    fields: input.fields,
    photos: photoMeta(input.photos),
    consents: {
      sms: buildConsentRecord({
        channel: "sms",
        granted: input.smsConsent,
        phone,
        sourcePath,
        formId: input.formId,
      }),
      email: buildConsentRecord({
        channel: "email",
        granted: input.emailConsent,
        email,
        sourcePath,
        formId: input.formId,
      }),
    },
  };
}

export async function submitLead(payload: LeadPayload) {
  const form = payload.type === "deals" ? "signup" : payload.type === "tv-mounting" ? "tv" : "book";
  const fields = payload.fields;
  const response = await fetch("/api/applications", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      form,
      name: fields.name ?? "",
      phone: fields.phone ?? "",
      email: fields.email ?? "",
      zip: fields.zip ?? "",
      service: fields.service ?? "",
      hearAbout: fields.hearAbout ?? "",
      formId: payload.source.formId,
      smsConsent: payload.consents.sms.granted,
      emailConsent: payload.consents.email.granted,
      details: fields,
    }),
  });
  const body = (await response.json().catch(() => null)) as { error?: string } | null;
  if (!response.ok) throw new Error(body?.error || "Could not send the request. Try again.");
  return { ok: true as const, payload };
}
