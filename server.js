import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/img', express.static('public/img'));

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

// TOTP Management endpoints
const SECRETS_FILE = 'totp_secrets.json';

// Load existing secrets
const loadSecrets = () => {
  try {
    if (fs.existsSync(SECRETS_FILE)) {
      const data = fs.readFileSync(SECRETS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading secrets:', error);
  }
  return {};
};

// Save secrets
const saveSecrets = (secrets) => {
  try {
    fs.writeFileSync(SECRETS_FILE, JSON.stringify(secrets, null, 2));
  } catch (error) {
    console.error('Error saving secrets:', error);
  }
};

// Generate new TOTP secret
app.post('/api/totp/generate', (req, res) => {
  try {
    const { account, issuer = 'Filamentincantati_controlPanel' } = req.body;
    
    if (!account) {
      return res.status(400).json({ error: 'Account email is required' });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `${issuer}:${account}`,
      issuer: issuer,
      length: 32
    });

    // Save to file
    const secrets = loadSecrets();
    secrets[account] = {
      secret: secret.base32,
      issuer: issuer,
      createdAt: new Date().toISOString()
    };
    saveSecrets(secrets);

    // Generate QR code
    const otpauthUrl = speakeasy.otpauthURL({
      secret: secret.base32,
      label: account,
      issuer: issuer,
      algorithm: 'sha1',
      digits: 6,
      period: 30
    });

    QRCode.toDataURL(otpauthUrl, (err, qrCodeDataUrl) => {
      if (err) {
        return res.status(500).json({ error: 'Error generating QR code' });
      }

      res.json({
        success: true,
        secret: secret.base32,
        qrCode: qrCodeDataUrl,
        otpauthUrl: otpauthUrl,
        message: 'TOTP secret generated successfully'
      });
    });
  } catch (error) {
    console.error('Error generating TOTP:', error);
    res.status(500).json({ error: 'Error generating TOTP secret' });
  }
});

// Verify TOTP token
app.post('/api/totp/verify', (req, res) => {
  try {
    const { account, token } = req.body;
    
    if (!account || !token) {
      return res.status(400).json({ error: 'Account and token are required' });
    }

    const secrets = loadSecrets();
    const userSecret = secrets[account];

    if (!userSecret) {
      return res.status(404).json({ error: 'No TOTP secret found for this account' });
    }

    const verified = speakeasy.totp.verify({
      secret: userSecret.secret,
      encoding: 'base32',
      token: token,
      window: 2 // Allow 2 time steps (60 seconds) for clock skew
    });

    res.json({
      success: true,
      verified: verified,
      message: verified ? 'Token verified successfully' : 'Invalid token'
    });
  } catch (error) {
    console.error('Error verifying TOTP:', error);
    res.status(500).json({ error: 'Error verifying TOTP token' });
  }
});

// Get TOTP status
app.get('/api/totp/status/:account', (req, res) => {
  try {
    const { account } = req.params;
    const secrets = loadSecrets();
    const userSecret = secrets[account];

    if (!userSecret) {
      return res.json({
        configured: false,
        message: 'TOTP not configured for this account'
      });
    }

    res.json({
      configured: true,
      issuer: userSecret.issuer,
      createdAt: userSecret.createdAt,
      message: 'TOTP is configured for this account'
    });
  } catch (error) {
    console.error('Error checking TOTP status:', error);
    res.status(500).json({ error: 'Error checking TOTP status' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Upload endpoint: http://localhost:${PORT}/api/upload-image`);
}); 