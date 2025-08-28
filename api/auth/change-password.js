import { sql as getSql, ensureSchema } from '../db.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    await ensureSchema();
    
    const { email, currentPassword, newPassword } = req.body || {};
    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Tutti i campi sono richiesti' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'La nuova password deve essere di almeno 8 caratteri' });
    }

    const sql = getSql();
    
    // Verify current password
    const users = await sql`SELECT id, password_hash FROM admin_users WHERE email = ${email}`;
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Utente non trovato' });
    }

    const user = users[0];
    
    if (user.password_hash !== currentPassword) {
      return res.status(401).json({ error: 'Password attuale non corretta' });
    }

    // Update password
    await sql`UPDATE admin_users SET password_hash = ${newPassword} WHERE id = ${user.id}`;

    return res.json({ success: true, message: 'Password aggiornata con successo' });
  } catch (e) {
    console.error('Change password error:', e);
    return res.status(500).json({ error: 'Errore server', details: e.message });
  }
}
