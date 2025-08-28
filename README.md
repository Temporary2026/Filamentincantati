# Filamentincantati - Gioielli Artigianali

Un sito web moderno e responsive per la vendita di gioielli artigianali realizzati a mano, con un pannello di amministrazione integrato per la gestione dei prodotti.

## ✨ Caratteristiche

- **Design Moderno**: Interfaccia elegante con palette colori pastello
- **Responsive**: Ottimizzato per tutti i dispositivi
- **Pannello Admin**: Gestione completa prodotti con autenticazione locale
- **Persistenza Dati**: Sistema localStorage avanzato con backup automatico
- **Sincronizzazione**: Condivisione dati tra dispositivi e tab
- **Gestione Immagini**: Upload locale con preview e ottimizzazione
- **Filtri Avanzati**: Ricerca, categorizzazione e ordinamento prodotti

## 🚀 Tecnologie

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Storage**: localStorage con backup automatico
- **Deployment**: Vercel (static hosting)

## 📁 Struttura Progetto

```
filamentincantati/
├── src/
│   ├── components/
│   │   ├── AdminPanel.tsx      # Pannello amministrazione
│   │   ├── AllProducts.tsx     # Pagina tutti i prodotti
│   │   ├── Collection.tsx      # Vetrina homepage
│   │   ├── Header.tsx          # Header sito
│   │   ├── Hero.tsx            # Sezione hero
│   │   └── ...                 # Altri componenti
│   ├── App.tsx                 # App principale
│   └── main.tsx                # Entry point
├── public/                     # Asset statici
├── all-products.html           # Pagina standalone prodotti
├── controlpanel0806.html       # Pagina standalone admin
└── index.html                  # Homepage
```

## 🔧 Installazione

1. **Clona il repository**
   ```bash
   git clone [url-repository]
   cd filamentincantati
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   ```

3. **Avvia in sviluppo**
   ```bash
   npm run dev
   ```

4. **Build per produzione**
   ```bash
   npm run build
   ```

## 🎯 Funzionalità Admin

### Accesso
- **Password**: `admin123` (configurabile nel codice)
- **Autenticazione**: Locale, senza 2FA
- **Sessione**: Persistente nel browser

### Gestione Prodotti
- ✅ **Aggiunta**: Nome, categoria, immagine, materiali, tecnica, prezzo
- ✅ **Modifica**: Aggiornamento completo prodotti esistenti
- ✅ **Eliminazione**: Rimozione sicura con conferma
- ✅ **Pubblicazione**: Controllo visibilità prodotti
- ✅ **Upload Immagini**: Supporto JPG, PNG, GIF (max 5MB)

### Sistema di Backup
- 🔄 **Backup Automatico**: Ogni 10 modifiche
- 💾 **Esportazione**: Database JSON completo
- 📥 **Importazione**: Ripristino da backup
- 🔄 **Sincronizzazione**: Tra dispositivi e tab

## 🌐 Deployment

### Vercel (Raccomandato)
1. **Connetti repository** GitHub a Vercel
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Deploy automatico** ad ogni push

### Altri Hosting Statici
- Netlify
- GitHub Pages
- Surge.sh

## 📱 Responsive Design

- **Mobile First**: Ottimizzato per smartphone
- **Tablet**: Layout adattivo intermedio
- **Desktop**: Esperienza completa
- **Touch Friendly**: Interfacce ottimizzate per touch

## 🎨 Personalizzazione

### Colori
Il progetto usa una palette personalizzata definita in `tailwind.config.js`:
- `pastel-aqua`: Colori principali
- `pastel-sky`: Accenti
- `pastel-rose`: Evidenziazioni

### Componenti
Tutti i componenti sono modulari e facilmente personalizzabili tramite props e CSS classes.

## 🔒 Sicurezza

- **Admin Panel**: Accesso protetto da password
- **Validazione Input**: Controlli sui dati inseriti
- **Sanitizzazione**: Prevenzione XSS e injection
- **Local Storage**: Dati salvati localmente, non inviati a server esterni

## 📊 Performance

- **Lazy Loading**: Caricamento ottimizzato immagini
- **Code Splitting**: Bundle separati per pagine
- **Optimization**: Build ottimizzato per produzione
- **Caching**: localStorage per dati frequenti

## 🛠️ Sviluppo

### Script Disponibili
- `npm run dev`: Server sviluppo
- `npm run build`: Build produzione
- `npm run lint`: Controllo codice
- `npm run preview`: Anteprima build

### Struttura Componenti
Ogni componente segue le best practices React:
- Hooks personalizzati per logica
- Props tipizzate con TypeScript
- Styling con Tailwind CSS
- Gestione stato locale

## 📝 Note

- **Compatibilità**: Chrome 90+, Firefox 88+, Safari 14+
- **Storage**: Richiede localStorage abilitato
- **Immagini**: Supporto per formati comuni web
- **Backup**: Salvataggio automatico ogni 10 modifiche

## 🤝 Contributi

1. Fork del progetto
2. Crea branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit modifiche (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri Pull Request

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi il file `LICENSE` per dettagli.

## 📞 Supporto

Per domande o supporto:
- 📧 Email: [email]
- 💬 Issues: GitHub Issues
- 📖 Documentazione: Questo README

---

**Filamentincantati** - Dove l'artigianato incontra la tecnologia ✨
