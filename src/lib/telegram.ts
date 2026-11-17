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
    body: JSON.stringify({
      chat_id: config.chatId,
      text: formatLeadTelegramMessage(lead),
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Telegram send failed (${response.status})`);
  }
}

/** Fire-and-forget; never throws into the application save path. */
export function notifyNewApplication(env: CmsEnv, lead: LeadNotification) {
  if (!telegramConfig(env)) return;

  const task = sendLeadTelegramNotification(env, lead).catch(() => {
    console.error("Telegram lead notification failed");
  });

  void scheduleBackground(task);
}

async function scheduleBackground(task: Promise<void>) {
  if (process.env.CMS_RUNTIME === "cloudflare") {
    try {
      const { getCloudflareContext } = await import("@opennextjs/cloudflare");
      const { ctx } = await getCloudflareContext({ async: true });
      ctx.waitUntil(task);
      return;
    } catch {
      // Fall through to local/dev behavior.
    }
  }
  await task;
}
