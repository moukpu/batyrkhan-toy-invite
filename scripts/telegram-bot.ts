import { setTimeout as sleep } from "node:timers/promises";
import { closePostgresPool } from "../src/lib/server/postgres.js";
import {
  attendanceStatusLabel,
  ensureRsvpSchema,
  getRsvpStats,
  listRsvps,
} from "../src/lib/server/rsvp-store.js";

const TELEGRAM_API_BASE = "https://api.telegram.org";
const TELEGRAM_TIMEOUT_SECONDS = 30;
const TELEGRAM_RETRY_DELAY_MS = 5_000;
const TELEGRAM_MESSAGE_LIMIT = 3_800;
const RSVP_TIME_ZONE = "Asia/Qyzylorda";

type TelegramUpdate = {
  update_id: number;
  message?: {
    chat?: {
      id?: number;
    };
    text?: string;
  };
};

type TelegramResponse<T> = {
  ok: boolean;
  result: T;
  description?: string;
};

function getTelegramBotToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured.");
  }

  return token;
}

function telegramApiUrl(method: string) {
  return `${TELEGRAM_API_BASE}/bot${getTelegramBotToken()}/${method}`;
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    timeZone: RSVP_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.hour}:${values.minute} ${values.day}.${values.month}.${values.year}`;
}

function splitMessage(text: string) {
  if (text.length <= TELEGRAM_MESSAGE_LIMIT) {
    return [text];
  }

  const chunks: string[] = [];
  let currentChunk = "";

  for (const line of text.split("\n")) {
    const nextChunk = currentChunk ? `${currentChunk}\n${line}` : line;

    if (nextChunk.length > TELEGRAM_MESSAGE_LIMIT) {
      if (currentChunk) {
        chunks.push(currentChunk);
      }

      currentChunk = line;
      continue;
    }

    currentChunk = nextChunk;
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

async function telegramRequest<T>(method: string, payload: Record<string, unknown>) {
  const response = await fetch(telegramApiUrl(method), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as TelegramResponse<T>;

  if (!response.ok || !data.ok) {
    throw new Error(data.description || `Telegram API request failed for ${method}.`);
  }

  return data.result;
}

async function sendMessage(chatId: number, text: string) {
  for (const chunk of splitMessage(text)) {
    await telegramRequest("sendMessage", {
      chat_id: chatId,
      text: chunk,
      disable_web_page_preview: true,
    });
  }
}

function formatRsvpList(
  entries: Awaited<ReturnType<typeof listRsvps>>,
  title: string
) {
  if (entries.length === 0) {
    return `${title}\n\nЖауаптар әлі жоқ.`;
  }

  const lines = entries.map(
    (entry) =>
      `${entry.name} — ${attendanceStatusLabel(entry.attendanceStatus)} — ${formatTimestamp(entry.updatedAt)}`
  );

  return `${title}\n\n${lines.join("\n")}`;
}

async function buildReply(command: string) {
  switch (command) {
    case "/start":
      return [
        "Batyrkhan RSVP bot",
        "",
        "/list — все ответы",
        "/yes — кто сказал, что придет",
        "/no — кто не сможет прийти",
        "/latest — последние ответы",
        "/stats — общая статистика",
      ].join("\n");
    case "/list":
      return formatRsvpList(await listRsvps(), "Барлық жауаптар");
    case "/yes":
      return formatRsvpList(
        await listRsvps({ attendanceStatus: "yes" }),
        "Келемін деп жауап бергендер"
      );
    case "/no":
      return formatRsvpList(
        await listRsvps({ attendanceStatus: "no" }),
        "Келе алмаймын деп жауап бергендер"
      );
    case "/latest":
      return formatRsvpList(
        await listRsvps({ sort: "latest", limit: 10 }),
        "Соңғы жауаптар"
      );
    case "/stats": {
      const stats = await getRsvpStats();

      return [
        "RSVP статистикасы",
        "",
        `Барлығы: ${stats.totalCount}`,
        `Келемін: ${stats.yesCount}`,
        `Келе алмаймын: ${stats.noCount}`,
      ].join("\n");
    }
    default:
      return 'Түсінбедім. Қол жетімді командаларды көру үшін /start деп жазыңыз.';
  }
}

async function handleUpdate(update: TelegramUpdate) {
  const chatId = update.message?.chat?.id;
  const text = update.message?.text?.trim();

  if (!chatId || !text || !text.startsWith("/")) {
    return;
  }

  const command = text.split(/\s+/)[0];
  const reply = await buildReply(command);
  await sendMessage(chatId, reply);
}

async function getUpdates(offset: number) {
  return telegramRequest<TelegramUpdate[]>("getUpdates", {
    offset,
    timeout: TELEGRAM_TIMEOUT_SECONDS,
    allowed_updates: ["message"],
  });
}

async function main() {
  await ensureRsvpSchema();

  let offset = 0;

  console.log("Telegram RSVP bot is running.");

  while (true) {
    try {
      const updates = await getUpdates(offset);

      for (const update of updates) {
        offset = update.update_id + 1;
        await handleUpdate(update);
      }
    } catch (error) {
      console.error("Telegram bot loop failed.", error);
      await sleep(TELEGRAM_RETRY_DELAY_MS);
    }
  }
}

function shutdown(signal: string) {
  console.log(`Received ${signal}, shutting down Telegram bot.`);
  closePostgresPool()
    .catch((error) => {
      console.error("Failed to close PostgreSQL pool cleanly.", error);
    })
    .finally(() => {
      process.exit(0);
    });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

main().catch((error) => {
  console.error("Telegram bot failed to start.", error);
  closePostgresPool()
    .catch(() => undefined)
    .finally(() => {
      process.exit(1);
    });
});
