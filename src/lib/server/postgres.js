import { Pool } from "pg";

const globalForPostgres = globalThis;

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return databaseUrl;
}

export function getPostgresPool() {
  if (!globalForPostgres.__invitationPostgresPool) {
    globalForPostgres.__invitationPostgresPool = new Pool({
      connectionString: getDatabaseUrl(),
    });
  }

  return globalForPostgres.__invitationPostgresPool;
}

export async function closePostgresPool() {
  if (!globalForPostgres.__invitationPostgresPool) {
    return;
  }

  await globalForPostgres.__invitationPostgresPool.end();
  globalForPostgres.__invitationPostgresPool = undefined;
}
