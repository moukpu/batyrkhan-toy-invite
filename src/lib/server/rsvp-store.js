import { getPostgresPool } from "./postgres";

/**
 * @typedef {"yes" | "no"} AttendanceStatus
 */

/**
 * @typedef {Object} RsvpRecord
 * @property {number} id
 * @property {string} name
 * @property {string} nameNormalized
 * @property {AttendanceStatus} attendanceStatus
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} ListRsvpsOptions
 * @property {AttendanceStatus} [attendanceStatus]
 * @property {"alphabetical" | "latest"} [sort]
 * @property {number} [limit]
 */

const RSVP_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS rsvps (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    name_normalized TEXT NOT NULL UNIQUE,
    attendance_status TEXT NOT NULL CHECK (attendance_status IN ('yes', 'no')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS rsvps_attendance_status_idx
    ON rsvps (attendance_status);

  CREATE INDEX IF NOT EXISTS rsvps_updated_at_idx
    ON rsvps (updated_at DESC);
`;

let schemaPromise;

function cleanGuestName(name) {
  return name.normalize("NFKC").replace(/\s+/g, " ").trim();
}

/**
 * @param {string} name
 */
export function normalizeGuestName(name) {
  return cleanGuestName(name).toLocaleLowerCase();
}

/**
 * @param {{
 *   id: number | string;
 *   name: string;
 *   name_normalized: string;
 *   attendance_status: AttendanceStatus;
 *   created_at: string | Date;
 *   updated_at: string | Date;
 * }} row
 * @returns {RsvpRecord}
 */
function mapRsvpRow(row) {
  return {
    id: Number(row.id),
    name: row.name,
    nameNormalized: row.name_normalized,
    attendanceStatus: row.attendance_status,
    createdAt:
      row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    updatedAt:
      row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
  };
}

/**
 * @param {AttendanceStatus} attendanceStatus
 */
export function attendanceStatusLabel(attendanceStatus) {
  return attendanceStatus === "yes" ? "келемін" : "келе алмаймын";
}

export async function ensureRsvpSchema() {
  if (!schemaPromise) {
    schemaPromise = getPostgresPool()
      .query(RSVP_SCHEMA_SQL)
      .catch((error) => {
        schemaPromise = undefined;
        throw error;
      });
  }

  await schemaPromise;
}

/**
 * @param {{ guestName: string; attendanceStatus: AttendanceStatus }} input
 * @returns {Promise<RsvpRecord>}
 */
export async function upsertRsvp({ guestName, attendanceStatus }) {
  const cleanedName = cleanGuestName(guestName);

  if (!cleanedName) {
    throw new Error("Guest name is required.");
  }

  if (attendanceStatus !== "yes" && attendanceStatus !== "no") {
    throw new Error("Attendance status must be either yes or no.");
  }

  await ensureRsvpSchema();

  const normalizedName = normalizeGuestName(cleanedName);
  const { rows } = await getPostgresPool().query(
    `
      INSERT INTO rsvps (name, name_normalized, attendance_status)
      VALUES ($1, $2, $3)
      ON CONFLICT (name_normalized)
      DO UPDATE SET
        name = EXCLUDED.name,
        attendance_status = EXCLUDED.attendance_status,
        updated_at = NOW()
      RETURNING id, name, name_normalized, attendance_status, created_at, updated_at
    `,
    [cleanedName, normalizedName, attendanceStatus]
  );

  return mapRsvpRow(rows[0]);
}

/**
 * @param {ListRsvpsOptions} [options]
 * @returns {Promise<RsvpRecord[]>}
 */
export async function listRsvps({
  attendanceStatus,
  sort = "alphabetical",
  limit,
} = {}) {
  await ensureRsvpSchema();

  const values = [];
  const conditions = [];

  if (attendanceStatus) {
    values.push(attendanceStatus);
    conditions.push(`attendance_status = $${values.length}`);
  }

  let query = `
    SELECT id, name, name_normalized, attendance_status, created_at, updated_at
    FROM rsvps
  `;

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query +=
    sort === "latest"
      ? " ORDER BY updated_at DESC, name ASC"
      : " ORDER BY name ASC, updated_at DESC";

  if (typeof limit === "number" && Number.isFinite(limit) && limit > 0) {
    values.push(Math.trunc(limit));
    query += ` LIMIT $${values.length}`;
  }

  const { rows } = await getPostgresPool().query(query, values);
  return rows.map(mapRsvpRow);
}

/**
 * @returns {Promise<{ totalCount: number; yesCount: number; noCount: number }>}
 */
export async function getRsvpStats() {
  await ensureRsvpSchema();

  const { rows } = await getPostgresPool().query(`
    SELECT
      COUNT(*)::int AS total_count,
      COUNT(*) FILTER (WHERE attendance_status = 'yes')::int AS yes_count,
      COUNT(*) FILTER (WHERE attendance_status = 'no')::int AS no_count
    FROM rsvps
  `);

  const stats = rows[0];

  return {
    totalCount: Number(stats.total_count ?? 0),
    yesCount: Number(stats.yes_count ?? 0),
    noCount: Number(stats.no_count ?? 0),
  };
}
