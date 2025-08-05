# Sistema di Gestione Collezione - Filamentincantati

## 🎯 Panoramica

Questo sistema ti permette di gestire completamente la collezione di gioielli Filamentincantati attraverso un'interfaccia di amministrazione protetta con autenticazione avanzata e Google Authenticator reale.

## 🔐 Accesso Admin Panel

### URL: `http://localhost:5174/controlpanel0806`

### Credenziali di Accesso:
- **Password**: `Filamentincantati2025!!@`
- **2FA**: Google Authenticator (codice di 6 cifre)

### Sicurezza Avanzata:
- ✅ **Password complessa** con caratteri speciali
- ✅ **Google Authenticator reale** con validazione TOTP
- ✅ **Chiave segreta predefinita** per configurazione sicura
- ✅ **Primo accesso protetto** con setup obbligatorio
- ✅ **Recupero password** via email
- ✅ **URL nascosto** per evitare attacchi automatici

## 📋 Funzionalità Principali

### 1. **Gestione Prodotti**
- ✅ Aggiungere nuovi prodotti
- ✅ Modificare prodotti esistenti
- ✅ Eliminare prodotti
- ✅ Pubblicare/nascondere prodotti
- ✅ Gestione categorie (Orecchini, Collane, Bracciali)

### 2. **Interfaccia Utente**
- ✅ Design responsive e moderno
- ✅ Filtri per categoria
- ✅ Anteprima immagini
- ✅ Gestione visibilità prodotti

### 3. **Sicurezza Avanzata**
- ✅ Autenticazione con password complessa
- ✅ Google Authenticator reale con validazione TOTP
- ✅ Chiave segreta predefinita e sicura
- ✅ Setup obbligatorio al primo accesso
- ✅ Recupero password via email
- ✅ Accesso protetto con URL nascosto
- ✅ Logout automatico

## 🛠️ Come Usare il Sistema

### Primo Accesso (Setup Iniziale):

1. **Vai all'URL**: `http://localhost:5174/controlpanel0806`
2. **Inserisci la password**: `Filamentincantati2025!!@`
3. **Inserisci qualsiasi codice di 6 cifre** (es: 123456)
4. **Clicca "Accedi"**
5. **Configura Google Authenticator** seguendo le istruzioni
6. **Scansiona il QR code** o inserisci manualmente la chiave
7. **Conferma la configurazione**

### Accessi Successivi:

1. **Vai all'URL**: `http://localhost:5174/controlpanel0806`
2. **Inserisci la password**: `Filamentincantati2025!!@`
3. **Apri Google Authenticator** sul tuo device
4. **Inserisci il codice** di 6 cifre generato
5. **Clicca "Accedi"**

### Recupero Password:

1. **Clicca** "Password dimenticata?"
2. **Inserisci** l'email: `filamentincantati@gmail.com`
3. **Ricevi** il link di reset via email
4. **Imposta** la nuova password

### Aggiungere un Nuovo Prodotto:

1. **Accedi** al pannello admin
2. **Clicca** "Aggiungi Prodotto"
3. **Compila** i campi obbligatori:
   - Nome Prodotto
   - Categoria
   - Immagine (caricamento diretto o URL)
   - Prezzo
   - Materiali
   - Tecnica
4. **Opzionale**: Aggiungi descrizione
5. **Decidi** se pubblicare immediatamente
6. **Clicca** "Aggiungi Prodotto"

### Gestire Prodotti Esistenti:

- **👁️ Mostra/Nascondi**: Toggle per pubblicare/nascondere
- **🗑️ Elimina**: Rimuovi il prodotto (con conferma)

## 📱 Pagine del Sito

### 1. **Homepage** (`/`)
- Mostra i primi 6 prodotti pubblicati
- Link "Vedi Tutta la Collezione"

### 2. **Tutta la Collezione** (`/all-products`)
- Mostra tutti i prodotti pubblicati
- Filtri per categoria
- Link diretti WhatsApp per richieste

### 3. **Admin Panel** (`/controlpanel0806`)
- Interfaccia di gestione protetta
- Solo per uso amministrativo
- Accesso con Google Authenticator reale

## 🎨 Personalizzazione

### Modificare le Credenziali:
Nel file `src/components/AdminPanel.tsx`:
```javascript
const ADMIN_PASSWORD = 'Filamentincantati2025!!@';  // Cambia questo
const PREDEFINED_SECRET = 'JBSWY3DPEHPK3PXP';  // Cambia questo!
```

### Configurare Google Authenticator:
1. **Scarica** Google Authenticator dal tuo app store
2. **Al primo accesso** segui le istruzioni automatiche
3. **Scansiona** il QR code o **inserisci** manualmente la chiave segreta
4. **Usa** i codici generati per l'accesso

### Aggiungere Nuove Categorie:
Modifica l'array `categories` nei componenti Collection e AllProducts.

## 🔧 Manutenzione

### Backup Dati:
I prodotti sono salvati nel localStorage del browser. Per un backup:
1. Apri DevTools (F12)
2. Vai su Application > Local Storage
3. Esporta la chiave `filamentincantati_products`

### Ripristino Dati:
1. Apri DevTools (F12)
2. Vai su Application > Local Storage
3. Importa la chiave `filamentincantati_products`

### Backup Google Authenticator:
La chiave segreta è salvata in localStorage come `filamentincantati_google_auth_secret`.
**⚠️ IMPORTANTE**: Non condividere mai questa chiave!

### Reset Configurazione Google Auth:
Per resettare la configurazione Google Authenticator:
1. Apri DevTools (F12)
2. Vai su Application > Local Storage
3. Elimina le chiavi:
   - `filamentincantati_google_auth_configured`
   - `filamentincantati_first_login`
   - `filamentincantati_google_auth_secret`

## 🚀 Avvio del Sistema

### Opzione 1: Avvio Completo (Raccomandato)
```bash
npm run dev:full
```
Questo comando avvia sia il server di upload che il frontend.

### Opzione 2: Avvio Separato
```bash
# Terminal 1 - Server di upload
npm run server

# Terminal 2 - Frontend
npm run dev
```

### URL di Accesso:
- **Frontend**: `http://localhost:5174`
- **Admin Panel**: `http://localhost:5174/controlpanel0806`
- **Server Upload**: `http://localhost:3001`

## 📸 Caricamento Immagini

### Funzionalità Implementate:
- ✅ **Caricamento diretto** da device (Windows, Mac, Mobile, Tablet)
- ✅ **Preview immediata** dell'immagine
- ✅ **Validazione file** (solo immagini, max 5MB)
- ✅ **Salvataggio automatico** in `./public/img/`
- ✅ **Nomi file univoci** con timestamp
- ✅ **Supporto multi-formato** (JPG, PNG, GIF, etc.)

### Come Usare:
1. **Accedi** al pannello admin (`/controlpanel0806`)
2. **Clicca** "Aggiungi Prodotto"
3. **Seleziona** l'area di caricamento immagini
4. **Clicca** "Seleziona Immagine" o trascina il file
5. **Visualizza** la preview
6. **Compila** gli altri campi
7. **Clicca** "Aggiungi Prodotto"

### Caratteristiche Tecniche:
- **Server**: Express.js con Multer per upload
- **Validazione**: Tipo file e dimensione (5MB max)
- **Storage**: Salvataggio in `./public/img/`
- **Naming**: `nomeoriginale_timestamp.estensione`
- **CORS**: Configurato per cross-origin requests

## 🔒 Sicurezza

### Caratteristiche di Sicurezza:
- **Password complessa**: `Filamentincantati2025!!@`
- **Google Authenticator reale**: Validazione TOTP con libreria speakeasy
- **Chiave segreta predefinita**: `JBSWY3DPEHPK3PXP` (CAMBIALA!)
- **URL nascosto**: `/controlpanel0806` invece di `/admin`
- **Recupero password**: Via email filamentincantati@gmail.com
- **Validazione 2FA**: Codice di 6 cifre con validazione reale
- **Setup obbligatorio**: Configurazione Google Auth al primo accesso
- **Window di validazione**: 2 time steps (60 secondi) per clock skew

### Best Practices:
- ✅ Cambia la password regolarmente
- ✅ Cambia la chiave segreta predefinita
- ✅ Non condividere le credenziali
- ✅ Usa sempre Google Authenticator
- ✅ Mantieni l'URL nascosto
- ✅ Backup regolari dei dati
- ✅ Non condividere la chiave segreta di Google Authenticator
- ✅ Mantieni sincronizzato l'orologio del device

## 🚀 Deployment

### Per il Production:
1. **Cambia le credenziali di default**:
   - Password: `Filamentincantati2025!!@`
   - Chiave segreta: `JBSWY3DPEHPK3PXP`
2. Implementa un backend per la persistenza dati
3. Aggiungi HTTPS per la sicurezza
4. Configura un dominio per l'admin panel
5. Configura il server di upload per production
6. Implementa Google Authenticator server-side
7. Configura email SMTP per il recupero password
8. Usa un database per salvare le chiavi segrete
9. Genera una nuova chiave segreta sicura per production

### Librerie Utilizzate:
- **speakeasy**: Per la validazione reale dei codici TOTP
- **@types/speakeasy**: Tipi TypeScript per speakeasy

## 📞 Supporto

Per problemi tecnici o domande:
- Email: filamentincantati@gmail.com
- WhatsApp: +39 329 538 1974

---

**⚠️ IMPORTANTE**: 
- Questo documento è confidenziale e non deve essere caricato su GitHub
- **Cambia OBBLIGATORIAMENTE** le credenziali di default prima di utilizzare il sistema in produzione
- **Cambia la chiave segreta predefinita** per maggiore sicurezza
- Mantieni sempre aggiornato Google Authenticator
- Fai backup regolari dei dati
- Non condividere mai la chiave segreta di Google Authenticator
- Mantieni sincronizzato l'orologio del device per evitare problemi di validazione 