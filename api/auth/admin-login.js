import { sql as getSql, ensureSchema, ensureAdminUser } from '../db.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    await ensureSchema();
    await ensureAdminUser();
    
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password richiesti' });
    }

    const sql = getSql();
    
    // Check if user exists and password matches
    const users = await sql`SELECT id, email, password_hash FROM admin_users WHERE email = ${email}`;
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    const user = users[0];
    
    // For now, simple password comparison (in production, use bcrypt)
    if (user.password_hash !== password) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    // Update last login
    await sql`UPDATE admin_users SET last_login = NOW() WHERE id = ${user.id}`;

    return res.json({ 
      success: true, 
      user: { id: user.id, email: user.email }
    });
  } catch (e) {
    console.error('Admin login error:', e);
    return res.status(500).json({ error: 'Errore server', details: e.message });
  }
}
