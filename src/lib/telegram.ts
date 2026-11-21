import type { ApplicationForm } from "./application-display";
import type { CmsEnv } from "./cms/types";

const FORM_LABELS: Record<ApplicationForm, string> = {
  book: "BOOK NOW",
  signup: "SIGN UP",
  tv: "TV",
};

type LeadNotification = {
  form: ApplicationForm;
  name: string;
  phone: string;
  email: string;
  service: string;
  zip: string;
};

function telegramEnabled(env: CmsEnv) {
  const flag = (env.TELEGRAM_ENABLED ?? "").trim().toLowerCase();
  return flag === "1" || flag === "true" || flag === "yes" || flag === "on";
}

function telegramConfig(env: CmsEnv) {
  const token = (env.TELEGRAM_BOT_TOKEN ?? "").trim();
  const chatId = (env.TELEGRAM_CHAT_ID ?? "").trim();
  if (!telegramEnabled(env) || !token || !chatId) return null;
  return { token, chatId };
}

export function formatLeadTelegramMessage(lead: LeadNotification) {
  const title = FORM_LABELS[lead.form] ?? "LEAD";
  return [
    `🔔 NEW LEAD — ${title}`,
    "",
    `👤 Name: ${lead.name || "—"}`,
    `📞 Phone: ${lead.phone || "—"}`,
    `✉️ Email: ${lead.email || "—"}`,
    `🔧 Service: ${lead.service || "—"}`,
    `📍 ZIP: ${lead.zip || "—"}`,
  ].join("\n");
}

async function sendLeadTelegramNotification(env: CmsEnv, lead: LeadNotification) {
  const config = telegramConfig(env);
  if (!config) return;

  const response = await fetch(`https://api.telegram.org/bot${config.token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    signal: AbortSignal.timeout(8000),
    body: JSON.stringify({
      chat_id: config.chatId,
      text: formatLeadTelegramMessage(lead),
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Telegram send failed (${response.status}) ${detail.slice(0, 300)}`);
  }
}

/** Awaited after the lead is stored. Failures are logged and do not fail the form. */
export async function notifyNewApplication(env: CmsEnv, lead: LeadNotification) {
  if (!telegramConfig(env)) return;
  try {
    await sendLeadTelegramNotification(env, lead);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    console.error(`Telegram lead notification failed: ${message}`);
  }
}
