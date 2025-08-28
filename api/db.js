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
    
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_login TIMESTAMPTZ
    );
  `;
}

export async function ensureAdminUser() {
  const sql = getSql();
  const adminEmail = process.env.ADMIN_EMAIL || 'liguori.daniela87@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  // Check if admin user exists
  const existingUser = await sql`SELECT id FROM admin_users WHERE email = ${adminEmail}`;
  if (existingUser.length === 0) {
    // Create default admin user (password should be changed on first login)
    await sql`
      INSERT INTO admin_users (id, email, password_hash)
      VALUES (${Date.now().toString()}, ${adminEmail}, ${adminPassword})
    `;
  }
}

export const sql = getSql;
