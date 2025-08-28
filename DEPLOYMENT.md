# 🚀 Deployment su Vercel

## Configurazione

Il progetto è configurato per funzionare su Vercel con le seguenti caratteristiche:

### 📁 File di Configurazione

- `vercel.json` - Configurazione Vercel per SPA e API
- `api/` - Endpoint API per Vercel Functions

### 🔧 Endpoint API

- `/api/totp/verify` - Verifica codici TOTP
- `/api/totp/generate` - Genera nuovi segreti TOTP
- `/api/totp/status/[account]` - Controlla status TOTP
- `/api/upload-image` - Upload immagini

### 🌐 Route Frontend

- `/` - Pagina principale
- `/controlpanel0806` - Pannello amministrazione
- `/all-products` - Tutti i prodotti

## Deployment

1. **Push su GitHub**: Assicurati che tutti i file siano committati
2. **Connettere a Vercel**: Importa il repository da GitHub
3. **Configurazione automatica**: Vercel rileverà automaticamente la configurazione

### ⚠️ Note Importanti

- **File esclusi**: `.bolt`, `.vscode`, `dist`, `node_modules` (già esclusi)
- **Environment**: `NODE_ENV=production` viene impostato automaticamente
- **Runtime**: Node.js 18.x per le API functions

### 🔒 Sicurezza

- **TOTP**: Configurato per `orarytempation2026@gmail.com`
- **Password**: `Filamentincantati2025!!@`
- **Servizio**: `Filamentincantati_controlPanel`

## Troubleshooting

### Errore 404 su `/controlpanel0806`
- Verifica che `vercel.json` sia presente
- Controlla che le route siano configurate correttamente

### API non funzionanti
- Verifica che i file in `api/` siano presenti
- Controlla i log di Vercel per errori

### Upload immagini
- Le immagini vengono salvate in `public/img/`
- Verifica i permessi di scrittura 