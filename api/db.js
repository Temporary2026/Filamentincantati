import { neon } from '@neondatabase/serverless';

const getSql = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL non configurato');
  }
  return neon(url);
};

export async function ensureSchema() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      image TEXT NOT NULL,
      materials TEXT NOT NULL,
      technique TEXT NOT NULL,
      price TEXT NOT NULL,
      description TEXT,
      is_published BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
}

export const sql = getSql;


