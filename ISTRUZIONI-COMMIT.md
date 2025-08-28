# 🚀 ISTRUZIONI PER COMMIT AUTOMATICO

## 📋 Script Disponibili

### 1. **prepare-commit.bat** (Windows Batch)
- **Doppio click** per eseguire
- Crea cartella `commit-files` con tutti i file necessari
- **NON copia** i file sensibili (protetti da .gitignore)

### 2. **prepare-commit.ps1** (PowerShell)
- **Tasto destro** → "Esegui con PowerShell"
- Versione avanzata con colori e controlli
- Stesso risultato del file .bat

### 3. **copy-to-root.bat** (Copia finale)
- Copia i file dalla cartella temporanea alla root
- Da eseguire DOPO prepare-commit.bat

## 🔄 FLUSSO COMPLETO

### **PASSO 1: Prepara i file**
```bash
# Doppio click su:
prepare-commit.bat
```
**Risultato**: Cartella `commit-files\` creata con tutti i file necessari

### **PASSO 2: Copia alla root**
```bash
# Doppio click su:
copy-to-root.bat
```
**Risultato**: File copiati dalla cartella temporanea alla root

### **PASSO 3: Commit su Git**
```bash
git add .
git commit -m "Aggiornamento progetto Filamentincantati"
git push origin main
```

## 📁 COSA VIENE COPIATO

### ✅ **File Essenziali:**
- `package.json` e `package-lock.json`
- `tailwind.config.js`, `vite.config.ts`
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- `vercel.json`, `server.js`
- `.gitignore`, `README.md`
- `eslint.config.js`, `postcss.config.js`
- `index.html`

### ✅ **Cartelle Complete:**
- `src/` - Tutto il codice React/TypeScript
- `public/` - Immagini e assets pubblici
- `api/` - Endpoint API per Vercel

## 🚫 COSA NON VIENE MAI COPIATO

### ❌ **File Protetti:**
- `ADMIN_README.md` - Password e credenziali
- `DEPLOYMENT.md` - Informazioni sensibili
- `NotePerProgetto.txt` - Account personali
- `.env` - Variabili d'ambiente
- `email_login_codes.json` - Codici 2FA
- `totp_secrets.json` - Segreti TOTP

## 🛡️ SICUREZZA

- **Automatico**: Non devi scegliere manualmente i file
- **Protetto**: I file sensibili sono sempre esclusi
- **Verificabile**: Controlla la cartella `commit-files\` prima del commit
- **Reversibile**: Puoi sempre annullare e ricreare

## 🔧 TROUBLESHOOTING

### **Errore "cartella commit-files non trovata"**
- Esegui prima `prepare-commit.bat`

### **File mancanti nel commit**
- Verifica che `copy-to-root.bat` sia stato eseguito
- Controlla che la cartella `commit-files\` contenga tutti i file

### **File sensibili nel commit**
- Verifica che `.gitignore` sia aggiornato
- Controlla che i file sensibili non siano già tracciati da Git

## 📝 NOTE IMPORTANTI

1. **Esegui sempre** `prepare-commit.bat` PRIMA di `copy-to-root.bat`
2. **Verifica** il contenuto della cartella `commit-files\` prima del commit
3. **Non modificare** manualmente i file nella cartella temporanea
4. **Usa sempre** questi script per evitare errori

---

**🎯 OBIETTIVO**: Committare solo i file necessari, escludendo automaticamente quelli sensibili.

