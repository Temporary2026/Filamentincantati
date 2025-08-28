import nodemailer from 'nodemailer';
import crypto from 'crypto';

const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return nodemailer.createTransport({ jsonTransport: true });
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE).toLowerCase() === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
};

function signToken(secret, email, code, exp) {
  const payload = `${email}.${code}.${exp}`;
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${code}.${exp}.${sig}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: 'Email richiesta' });

    const secret = process.env.AUTH_SECRET;
    if (!secret) return res.status(500).json({ error: 'AUTH_SECRET non configurato' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minuti
    const token = signToken(secret, email, code, expiresAt);

    const mailer = createTransporter();
    const mailOptions = {
      from: process.env.SMTP_FROM || 'no-reply@filamentincantati.local',
      to: email,
      subject: 'Codice di accesso - Filamentincantati',
      text: `Il tuo codice di accesso è: ${code}\nScade in 10 minuti.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f766e;">Codice di Accesso - Filamentincantati</h2>
          <p>Ecco il tuo codice di accesso per il pannello amministrativo:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #0f766e; font-size: 32px; margin: 0; letter-spacing: 4px;">${code}</h1>
          </div>
          <p><strong>⚠️ Attenzione:</strong> Questo codice scade in 10 minuti.</p>
          <p>Se non hai richiesto questo codice, ignora questa email.</p>
        </div>
      `,
    };

    await mailer.sendMail(mailOptions);
    return res.json({ success: true, token });
  } catch (e) {
    return res.status(500).json({ error: 'Impossibile inviare il codice' });
  }
}

