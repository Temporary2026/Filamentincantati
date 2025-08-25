import speakeasy from 'speakeasy';
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

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
} 