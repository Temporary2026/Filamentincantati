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
      
      // Validate required fields
      if (!id || !name || !category || !image || !materials || !technique || !price) {
        console.error('Missing required fields:', { id, name, category, image, materials, technique, price });
        return res.status(400).json({ error: 'Campi obbligatori mancanti' });
      }

      try {
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
        
        console.log('Product saved successfully:', { id, name });
        return res.json({ success: true, message: 'Prodotto salvato con successo' });
      } catch (dbError) {
        console.error('Database error:', dbError);
        return res.status(500).json({ error: 'Errore nel salvataggio del prodotto', details: dbError.message });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('Products endpoint error:', e);
    return res.status(500).json({ error: 'Errore server', details: e.message });
  }
}
