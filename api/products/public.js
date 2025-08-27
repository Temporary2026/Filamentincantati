import { sql as getSql, ensureSchema } from '../db.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    await ensureSchema();
    const sql = getSql();
    const rows = await sql`SELECT id, name, category, image, materials, technique, price, description, is_published AS "isPublished", created_at AS "createdAt" FROM products WHERE is_published = true ORDER BY created_at DESC`;
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ error: 'Errore server', details: e.message });
  }
}


