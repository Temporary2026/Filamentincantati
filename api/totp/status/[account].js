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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { account } = req.query;
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
} 