export const fieldClass =
  "mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export const textareaClass =
  "mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm transition-colors duration-200 placeholder:text-muted-foreground/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export const buttonPrimaryClass =
  "inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-60";

export const buttonSecondaryClass =
  "inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-foreground hover:text-background";

export const phonePattern = /^[\d+\s()-]{10,20}$/;
export const zipPattern = /^\d{5}(?:-\d{4})?$/;
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
