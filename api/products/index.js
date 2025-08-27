import { sql as getSql, ensureSchema } from '../db.js';

export default async function handler(req, res) {
  try {
    await ensureSchema();
    const sql = getSql();

    if (req.method === 'GET') {
      const rows = await sql`SELECT id, name, category, image, materials, technique, price, description, is_published AS "isPublished", created_at AS "createdAt" FROM products ORDER BY created_at DESC`;
      return res.json(rows);
    }

    if (req.method === 'POST') {
      const { id, name, category, image, materials, technique, price, description, isPublished } = req.body || {};
      if (!id || !name || !category || !image || !materials || !technique || !price) {
        return res.status(400).json({ error: 'Campi obbligatori mancanti' });
      }
      await sql`
        INSERT INTO products (id, name, category, image, materials, technique, price, description, is_published)
        VALUES (${id}, ${name}, ${category}, ${image}, ${materials}, ${technique}, ${price}, ${description || null}, ${Boolean(isPublished)})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          category = EXCLUDED.category,
          image = EXCLUDED.image,
          materials = EXCLUDED.materials,
          technique = EXCLUDED.technique,
          price = EXCLUDED.price,
          description = EXCLUDED.description,
          is_published = EXCLUDED.is_published
      `;
      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: 'Errore server', details: e.message });
  }
}


