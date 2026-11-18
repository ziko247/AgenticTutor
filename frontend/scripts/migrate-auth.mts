import { getMigrations } from "better-auth/db/migration";
import { authOptions } from "../src/features/auth/server.ts";

const options = authOptions();
try {
  const { runMigrations } = await getMigrations(options);
  await runMigrations();
  console.log("Base des comptes et des sessions prête.");
} finally {
  options.database.close();
}
