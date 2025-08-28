import { sql as getSql, ensureSchema } from '../db.js';

export default async function handler(req, res) {
  try {
    await ensureSchema();
    const sql = getSql();
    const { id } = req.query || {};
    if (!id) return res.status(400).json({ error: 'ID richiesto' });

    if (req.method === 'DELETE') {
      await sql`DELETE FROM products WHERE id = ${id}`;
      return res.json({ success: true });
    }

    if (req.method === 'PATCH' || req.method === 'PUT') {
      const { name, category, image, materials, technique, price, description, isPublished } = req.body || {};
      await sql`
        UPDATE products SET
          name = COALESCE(${name}, name),
          category = COALESCE(${category}, category),
          image = COALESCE(${image}, image),
          materials = COALESCE(${materials}, materials),
          technique = COALESCE(${technique}, technique),
          price = COALESCE(${price}, price),
          description = COALESCE(${description}, description),
          is_published = COALESCE(${typeof isPublished === 'boolean' ? isPublished : null}, is_published)
        WHERE id = ${id}
      `;
      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: 'Errore server', details: e.message });
  }
}



