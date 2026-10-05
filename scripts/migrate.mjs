// Applies pending SQL files from supabase/migrations to the database in SUPABASE_DB_URL (.env.local).
// Applied versions are tracked in supabase_migrations.schema_migrations, the same table the Supabase CLI uses.
//
//   npm run db:migrate                      apply pending migrations
//   npm run db:migrate -- --status          list applied / pending without changing anything
//   npm run db:migrate -- --mark-applied V  record version(s) V as applied without running them
import { existsSync, readFileSync, readdirSync } from "node:fs";
import pg from "pg";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error("SUPABASE_DB_URL is not set. Add the Session pooler URI from Supabase → Connect to .env.local.");
  process.exit(1);
}

const DIR = "supabase/migrations";
const files = readdirSync(DIR)
  .filter((f) => /^\d+_.+\.sql$/.test(f))
  .sort()
  .map((file) => ({ file, version: file.split("_")[0], name: file.replace(/^\d+_|\.sql$/g, "") }));

const args = process.argv.slice(2);
const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();

try {
  await client.query(`
    create schema if not exists supabase_migrations;
    create table if not exists supabase_migrations.schema_migrations (version text primary key, statements text[], name text);
  `);
  const { rows } = await client.query("select version from supabase_migrations.schema_migrations");
  const applied = new Set(rows.map((r) => r.version));

  if (args[0] === "--mark-applied") {
    for (const version of args.slice(1)) {
      const m = files.find((f) => f.version === version);
      if (!m) throw new Error(`No migration file with version ${version}`);
      await client.query(
        "insert into supabase_migrations.schema_migrations (version, name, statements) values ($1, $2, $3) on conflict do nothing",
        [m.version, m.name, [readFileSync(`${DIR}/${m.file}`, "utf8")]],
      );
      console.log(`marked applied  ${m.file}`);
    }
  } else if (args[0] === "--status") {
    for (const m of files) console.log(`${applied.has(m.version) ? "applied" : "PENDING"}  ${m.file}`);
  } else {
    const pending = files.filter((m) => !applied.has(m.version));
    if (pending.length === 0) console.log("Database is up to date.");
    for (const m of pending) {
      const sql = readFileSync(`${DIR}/${m.file}`, "utf8");
      await client.query("begin");
      try {
        await client.query(sql);
        await client.query("insert into supabase_migrations.schema_migrations (version, name, statements) values ($1, $2, $3)", [
          m.version,
          m.name,
          [sql],
        ]);
        await client.query("commit");
        console.log(`applied  ${m.file}`);
      } catch (err) {
        await client.query("rollback");
        throw new Error(`${m.file} failed and was rolled back: ${err.message}`);
      }
    }
  }
} finally {
  await client.end();
}
