import crypto from 'crypto';

function verifyToken(secret, email, code, token) {
  const parts = String(token).split('.');
  if (parts.length !== 3) return false;
  const [tokenCode, exp, sig] = parts;
  if (tokenCode !== code) return false;
  const expMs = Number(exp);
  if (!Number.isFinite(expMs) || Date.now() > expMs) return false;
  const payload = `${email}.${tokenCode}.${exp}`;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { email, code, token } = req.body || {};
    if (!email || !code || !token) return res.status(400).json({ error: 'Email, codice e token richiesti' });

    const secret = process.env.AUTH_SECRET;
    if (!secret) return res.status(500).json({ error: 'AUTH_SECRET non configurato' });

    const valid = verifyToken(secret, email, code, token);
    return res.json({ success: Boolean(valid) });
  } catch (e) {
    return res.status(500).json({ error: 'Errore di verifica' });
  }
}

