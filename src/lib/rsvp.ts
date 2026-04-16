import type { AttendanceOption } from "@/lib/event-data";

export type RsvpPayload = {
  guestName: string;
  attendance: AttendanceOption;
};

export const RSVP_API_ENDPOINT = "/api/rsvp";

const MOCK_DELAY_MS = 1400;

export async function submitRsvp(payload: RsvpPayload) {
  if (process.env.NEXT_PUBLIC_USE_MOCK_RSVP === "true") {
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

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.error ?? "Failed to send RSVP.");
  }

  return result;
}
