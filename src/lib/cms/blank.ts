/** Empty CMS text. Zero and false stay visible. */
export function cmsText(value: unknown, editing = false): string {
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "string" && value.trim() !== "") return value;
  return editing ? "Not filled" : "—";
}
