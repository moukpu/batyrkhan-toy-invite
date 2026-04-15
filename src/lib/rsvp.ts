import type { AttendanceOption } from "@/lib/event-data";

export type RsvpPayload = {
  guestName: string;
  attendance: AttendanceOption;
};

export const RSVP_API_ENDPOINT = "/api/rsvp";

const MOCK_DELAY_MS = 1400;

export async function submitRsvp(payload: RsvpPayload) {
  if (process.env.NEXT_PUBLIC_USE_MOCK_RSVP !== "false") {
    await new Promise((resolve) => {
      window.setTimeout(resolve, MOCK_DELAY_MS);
    });

    return {
      ok: true,
      mode: "mock" as const,
      payload,
    };
  }

  const response = await fetch(RSVP_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Қатысу жауабын жіберу кезінде қате пайда болды.");
  }

  return response.json();
}
