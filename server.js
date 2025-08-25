import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Carica variabili d'ambiente da .env se presente
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Debug: mostra configurazione SMTP
console.log('=== Configurazione SMTP ===');
console.log('SMTP_HOST:', process.env.SMTP_HOST || 'NON CONFIGURATO');
console.log('SMTP_PORT:', process.env.SMTP_PORT || 'NON CONFIGURATO');
console.log('SMTP_USER:', process.env.SMTP_USER || 'NON CONFIGURATO');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'CONFIGURATO' : 'NON CONFIGURATO');
console.log('SMTP_SECURE:', process.env.SMTP_SECURE || 'NON CONFIGURATO');
console.log('SMTP_FROM:', process.env.SMTP_FROM || 'NON CONFIGURATO');
console.log('==========================');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/img', express.static('public/img'));

// Email 2FA storage
const CODES_FILE = 'email_login_codes.json';
const loadCodes = () => {
  try {
    if (fs.existsSync(CODES_FILE)) {
      const data = fs.readFileSync(CODES_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (_) {}
  return {};
};
const saveCodes = (codes) => {
  try {
    fs.writeFileSync(CODES_FILE, JSON.stringify(codes, null, 2));
  } catch (_) {}
};

// Nodemailer transporter con gestione errori migliorata
const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  
  // Verifica che tutte le variabili SMTP siano configurate
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.log('❌ Configurazione SMTP incompleta - usando fallback jsonTransport');
    return nodemailer.createTransport({ 
      jsonTransport: true,
      logger: false,
      debug: false
    });
  }

  try {
    console.log('✅ Configurazione SMTP completa - creando transporter...');
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: SMTP_SECURE === 'true',
      auth: { 
        user: SMTP_USER, 
        pass: SMTP_PASS 
      },
      // Timeout e retry per maggiore affidabilità
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // Verifica connessione
    transporter.verify((error, success) => {
      if (error) {
        console.log('❌ Errore connessione SMTP:', error.message);
      } else {
        console.log('✅ Connessione SMTP verificata con successo');
      }
    });

    return transporter;
  } catch (error) {
    console.log('❌ Errore creazione transporter SMTP:', error.message);
    console.log('🔄 Fallback a jsonTransport');
    return nodemailer.createTransport({ 
      jsonTransport: true,
      logger: false,
      debug: false
    });
  }
};

const mailer = createTransporter();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'public/img';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    const fileName = `${baseName}_${timestamp}${extension}`;
    cb(null, fileName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo file immagine sono permessi!'), false);
    }
  }
});

// Upload endpoint
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nessun file caricato' });
    }

    const imagePath = `/img/${req.file.filename}`;
    
    res.json({
      success: true,
      path: imagePath,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Errore nel caricamento del file' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Il file è troppo grande. Massimo 5MB.' });
    }
  }
  
  console.error('Server error:', error);
  res.status(500).json({ error: 'Errore del server' });
});

// Nuovi endpoint: Email 2FA (OTP via email)
app.post('/api/auth/request-code', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email richiesta' });

    // Genera codice a 6 cifre
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minuti

    // Salva codice su file (per singola email)
    const codes = loadCodes();
    codes[email] = { code, expiresAt };
    saveCodes(codes);

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
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">Filamentincantati - Sistema di Gestione Collezione</p>
        </div>
      `
    };

    try {
      const info = await mailer.sendMail(mailOptions);
      
      if (info.messageId) {
        console.log('✅ Email 2FA inviata con successo a:', email);
        console.log('   Message ID:', info.messageId);
        res.json({ success: true, message: 'Codice inviato con successo' });
      } else {
        // Fallback jsonTransport
        console.log('📧 Email 2FA simulata (jsonTransport) a:', email);
        console.log('   Contenuto email:', info.message);
        res.json({ 
          success: true, 
          message: 'Codice generato (email simulata - controlla console server)',
          debug: { code, email }
        });
      }
    } catch (emailError) {
      console.error('❌ Errore invio email:', emailError.message);
      res.status(500).json({ 
        error: 'Impossibile inviare email', 
        details: emailError.message,
        debug: { code, email }
      });
    }
  } catch (err) {
    console.error('❌ Errore generazione codice:', err.message);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

app.post('/api/auth/verify-code', (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: 'Email e codice richiesti' });

    const codes = loadCodes();
    const entry = codes[email];
    if (!entry) return res.json({ success: false });

    const isValid = entry.code === code && Date.now() < entry.expiresAt;

    if (isValid) {
      // Usa one-time code: invalida
      delete codes[email];
      saveCodes(codes);
      console.log('✅ Codice 2FA verificato con successo per:', email);
      return res.json({ success: true });
    }

    console.log('❌ Codice 2FA non valido per:', email);
    res.json({ success: false });
  } catch (err) {
    console.error('❌ Errore verifica codice 2FA email:', err.message);
    res.status(500).json({ error: 'Errore di verifica' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📤 Upload endpoint: http://localhost:${PORT}/api/upload-image`);
  console.log(`🔐 Email 2FA endpoints: /api/auth/request-code, /api/auth/verify-code`);
}); 