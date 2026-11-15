import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import EmbeddedPostgres from "embedded-postgres";

const databaseDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../.data/postgres",
);

const postgres = new EmbeddedPostgres({
  databaseDir,
  user: "education",
  password: "education",
  port: 5432,
  persistent: true,
  initdbFlags: ["--encoding=UTF8", "--locale=C"],
});

if (!fs.existsSync(path.join(databaseDir, "PG_VERSION"))) {
  await postgres.initialise();
}

await postgres.start();

try {
  await postgres.createDatabase("education_togo");
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  if (!message.includes("already exists")) {
    throw error;
  }
}

console.log("PostgreSQL local prêt : localhost:5432 / education_togo");

const stop = async () => {
  await postgres.stop();
  process.exit(0);
};

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
