import { closePostgresPool } from "../src/lib/server/postgres.js";
import { ensureRsvpSchema } from "../src/lib/server/rsvp-store.js";

async function main() {
  await ensureRsvpSchema();
  console.log("RSVP database schema is ready.");
}

main()
  .catch((error) => {
    console.error("Failed to prepare RSVP database schema.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePostgresPool();
  });
