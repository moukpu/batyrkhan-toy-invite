import type { AttendanceOption } from "@/lib/event-data";
import { upsertRsvp } from "@/lib/server/rsvp-store";

export const runtime = "nodejs";

type RsvpRequestBody = {
  guestName?: unknown;
  attendance?: unknown;
};

function isAttendanceOption(value: unknown): value is AttendanceOption {
  return value === "yes" || value === "no";
}

export async function POST(request: Request) {
  let body: RsvpRequestBody;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  if (typeof body.guestName !== "string" || !body.guestName.trim()) {
    return Response.json(
      { ok: false, error: "Guest name is required." },
      { status: 400 }
    );
  }

  if (!isAttendanceOption(body.attendance)) {
    return Response.json(
      { ok: false, error: "Attendance status is invalid." },
      { status: 400 }
    );
  }

  try {
    const rsvp = await upsertRsvp({
      guestName: body.guestName,
      attendanceStatus: body.attendance,
    });

    return Response.json({ ok: true, mode: "database", rsvp });
  } catch (error) {
    console.error("Failed to save RSVP submission.", error);

    return Response.json(
      { ok: false, error: "Failed to save RSVP." },
      { status: 500 }
    );
  }
}
