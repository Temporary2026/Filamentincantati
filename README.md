# Filamentincantati - Sito Web Gioielli Artigianali

## 🎯 Descrizione

Sito web per la collezione di gioielli artigianali Filamentincantati, realizzato con React, TypeScript e Tailwind CSS.

## 🚀 Tecnologie Utilizzate

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Backend**: Node.js + Express
- **Database**: Neon Postgres (serverless) tramite API serverless Vercel

## 📁 Struttura Progetto

```
src/
├── components/          # Componenti React
│   ├── Header.tsx      # Header del sito
│   ├── Hero.tsx        # Sezione hero principale
│   ├── Collection.tsx  # Vetrina prodotti
│   ├── AllProducts.tsx # Pagina completa collezione
│   ├── AdminPanel.tsx  # Pannello amministrativo
│   └── ...
├── App.tsx             # Componente principale
└── main.tsx            # Entry point
```

## 🛠️ Installazione e Avvio

### Prerequisiti
- Node.js 18+ 
- npm o yarn

### Setup
```bash
# Clona il repository
git clone [repository-url]
cd Filamentincantati

# Installa le dipendenze
npm install

# Avvia il server backend
npm run server

# In un nuovo terminale, avvia il frontend
npm run dev
```

### Script Disponibili
- `npm run dev` - Avvia il frontend in modalità sviluppo
- `npm run server` - Avvia il server backend
- `npm run dev:full` - Avvia entrambi contemporaneamente
- `npm run build` - Build per produzione

## 🌐 Accesso al Sito

- **Frontend**: http://localhost:5174/
- **Backend**: http://localhost:3001/
- **Admin Panel**: Solo per amministratori autorizzati

## 🔒 Sicurezza

Il progetto implementa un sistema di autenticazione a due fattori per l'accesso amministrativo. Le credenziali e le configurazioni sensibili sono gestite tramite variabili d'ambiente e non sono mai esposte nel codice sorgente.

### Variabili d'Ambiente (Vercel)
- `DATABASE_URL` → impostata automaticamente dall'integrazione Neon su Vercel (Connection string Postgres con `sslmode=require`)
- `AUTH_SECRET` → da impostare manualmente (segreto firma token 2FA)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE`, `SMTP_FROM` → per invio email 2FA

## 📱 Funzionalità

### Pubblico
- ✅ Visualizzazione collezione gioielli
- ✅ Filtri per categoria
- ✅ Ricerca prodotti
- ✅ Contatti diretti WhatsApp
- ✅ Design responsive

### Amministrativo
- ✅ Gestione prodotti completa
- ✅ Upload immagini
- ✅ Controllo visibilità
- ✅ Backup e ripristino dati
- ✅ Sistema di autenticazione sicuro

## 🎨 Personalizzazione

Il sito utilizza un sistema di colori personalizzato basato su palette pastel. I colori principali sono definiti in `tailwind.config.js` e possono essere facilmente modificati.

## 📄 Licenza

Progetto privato per Filamentincantati. Tutti i diritti riservati.

## 📞 Supporto

Per supporto tecnico o domande, contattare l'amministratore del sistema.

---

**⚠️ IMPORTANTE**: Questo repository contiene solo il codice sorgente pubblico. Le configurazioni sensibili, credenziali e dati amministrativi sono gestiti separatamente e non sono mai committati su GitHub.
