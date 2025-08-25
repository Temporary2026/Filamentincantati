import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import fs from 'fs';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

    res.json({
      success: true,
      secret: secret.base32,
      qrCode: qrCodeDataUrl,
      otpauthUrl: otpauthUrl,
      message: 'TOTP secret generated successfully'
    });
  } catch (error) {
    console.error('Error generating TOTP:', error);
    res.status(500).json({ error: 'Error generating TOTP secret' });
  }
} 