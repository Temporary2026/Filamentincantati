import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Plus, Trash2, X, Shield, Upload, Download } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: 'orecchini' | 'collane' | 'bracciali';
  image: string;
  materials: string;
  technique: string;
  price: string;
  description?: string;
  isPublished: boolean;
  createdAt: string;
}

const PASSWORD_KEY = 'filamentincantati_admin_password';
const ADMIN_EMAIL = 'liguori.daniela87@gmail.com';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [emailAuthToken, setEmailAuthToken] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [configWarning, setConfigWarning] = useState<string | null>(null);

  // API base: allow override via VITE_API_BASE; defaults to same-origin in prod, localhost:3001 in dev
  const API_BASE = (import.meta as any).env?.VITE_API_BASE
    ? String((import.meta as any).env.VITE_API_BASE).replace(/\/$/, '')
    : (import.meta.env.PROD ? '' : 'http://localhost:3001');

  const [products, setProducts] = useState<Product[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: 'orecchini',
    image: '',
    materials: '',
    technique: '',
    price: '',
    description: '',
    isPublished: true
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Primo accesso: setup password
  const [isFirstAccess, setIsFirstAccess] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const savedPassword = localStorage.getItem(PASSWORD_KEY);
    setIsFirstAccess(!savedPassword);
  }, []);

  // Load/save products
  const loadProducts = () => {
    const savedProducts = localStorage.getItem('filamentincantati_products');
    if (savedProducts) setProducts(JSON.parse(savedProducts));
  };
  const saveProducts = (updatedProducts: Product[]) => {
    localStorage.setItem('filamentincantati_products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
  };

  // Upload helpers
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) { alert('Seleziona solo file immagine'); return; }
      if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return; }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };
  const triggerFileInput = () => fileInputRef.current?.click();

  // Password setup
  const handleSetPassword = () => {
    setErrorMsg('');
    if (newPassword.length < 8) { setErrorMsg('La password deve essere di almeno 8 caratteri'); return; }
    if (newPassword !== confirmPassword) { setErrorMsg('Le password non coincidono'); return; }
    localStorage.setItem(PASSWORD_KEY, newPassword);
    setIsFirstAccess(false);
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
    alert('Password impostata con successo! Ora effettua il login.');
  };

  // Email 2FA
  const requestEmailCode = async () => {
    try {
      setSending(true);
      setErrorMsg('');
      setConfigWarning(null);
      const url = `${API_BASE}/api/auth/request-code`;
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: ADMIN_EMAIL }) });
      if (!res.ok) throw new Error('Invio fallito');
      const data = await res.json();
      if (data.success) {
        setCodeSent(true);
        setEmailAuthToken(data.token || null);
        if (import.meta.env.PROD && !data.token) {
          setConfigWarning('Configurazione 2FA mancante: imposta AUTH_SECRET e SMTP_* nelle Environment Variables su Vercel.');
        }
      } else {
        setErrorMsg('Impossibile inviare il codice');
      }
    } catch (_) {
      setErrorMsg('Impossibile inviare il codice');
      if (import.meta.env.PROD) {
        setConfigWarning('Errore invio codice. Verifica AUTH_SECRET e SMTP_* su Vercel.');
      }
    } finally {
      setSending(false);
    }
  };

  const verifyEmailCode = async () => {
    setErrorMsg('');
    const savedPassword = localStorage.getItem(PASSWORD_KEY);
    if (!savedPassword || password !== savedPassword) { setErrorMsg('Password non valida'); return; }
    if (emailCode.length !== 6) { setErrorMsg('Inserisci il codice ricevuto via email'); return; }
    if (!emailAuthToken) { setErrorMsg('Token non presente. Clicca "Invia codice" e riprova.'); return; }
    try {
      const url = `${API_BASE}/api/auth/verify-code`;
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: ADMIN_EMAIL, code: emailCode, token: emailAuthToken }) });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        loadProducts();
      } else {
        setErrorMsg('Codice non valido o scaduto');
      }
    } catch (_) {
      setErrorMsg('Errore di verifica');
    }
  };

  // UI: Primo accesso (setup password)
  if (isFirstAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-aqua-50 to-pastel-sky-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-pastel-aqua-100 rounded-full mb-4">
              <Shield className="text-pastel-aqua-600" size={32} />
            </div>
            <h1 className="text-2xl font-serif text-pastel-aqua-900 mb-2">Imposta Password Admin</h1>
            <p className="text-pastel-aqua-700">Scegli una password sicura</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">Nuova Password</label>
              <div className="relative">
                <input type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500 focus:border-transparent" placeholder="Inserisci la nuova password" />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pastel-aqua-500 hover:text-pastel-aqua-700">{showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">Conferma Password</label>
              <div className="relative">
                <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500 focus:border-transparent" placeholder="Conferma la password" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pastel-aqua-500 hover:text-pastel-aqua-700">{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
              </div>
            </div>
            {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}
            <button onClick={handleSetPassword} className="w-full bg-pastel-aqua-600 text-white py-3 rounded-lg font-semibold hover:bg-pastel-aqua-700 transition-colors">Imposta Password</button>
          </div>
        </div>
      </div>
    );
  }

  // UI: Login (password + email code)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-aqua-50 to-pastel-sky-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          {configWarning && (
            <div className="mb-4 p-3 rounded bg-yellow-100 text-yellow-800 text-sm">
              {configWarning}
            </div>
          )}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-pastel-aqua-100 rounded-full mb-4">
              <Shield className="text-pastel-aqua-600" size={32} />
            </div>
            <h1 className="text-2xl font-serif text-pastel-aqua-900 mb-2">Admin Panel</h1>
            <p className="text-pastel-aqua-700">Accesso con password + codice email</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500 focus:border-transparent" placeholder="Inserisci la password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pastel-aqua-500 hover:text-pastel-aqua-700">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">Codice ricevuto via email</label>
                <button onClick={requestEmailCode} disabled={sending} className="text-sm px-3 py-2 rounded bg-pastel-aqua-600 text-white hover:bg-pastel-aqua-700 disabled:opacity-60">{sending ? 'Invio...' : codeSent ? 'Reinvia codice' : 'Invia codice'}</button>
              </div>
              <input type="text" value={emailCode} onChange={e => setEmailCode(e.target.value)} className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500 focus:border-transparent" placeholder="Inserisci il codice (6 cifre)" maxLength={6} />
            </div>
            {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}
            <button onClick={verifyEmailCode} className="w-full bg-pastel-aqua-600 text-white py-3 rounded-lg font-semibold hover:bg-pastel-aqua-700 transition-colors">Accedi</button>
          </div>
        </div>
      </div>
    );
  }

  // UI: Pannello amministratore
  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-aqua-50 to-pastel-sky-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-serif text-pastel-aqua-900">Gestione Collezione</h1>
              <p className="text-pastel-aqua-700">Filamentincantati - Admin Panel</p>
            </div>
            <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 bg-pastel-rose-500 text-white rounded-lg hover:bg-pastel-rose-600 transition-colors">Logout</button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button onClick={() => setIsAddingProduct(true)} className="bg-pastel-aqua-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pastel-aqua-700 transition-colors flex items-center">
            <Plus className="mr-2" size={20} />
            Aggiungi Prodotto
          </button>
          
          {/* Backup Database */}
          <button 
            onClick={() => {
              const dataStr = JSON.stringify(products, null, 2);
              const dataBlob = new Blob([dataStr], { type: 'application/json' });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `filamentincantati_products_${new Date().toISOString().split('T')[0]}.json`;
              link.click();
              URL.revokeObjectURL(url);
              alert(`Database esportato con successo! Contiene ${products.length} prodotti.`);
            }}
            className="bg-pastel-sky-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pastel-sky-700 transition-colors flex items-center"
          >
            <Download className="mr-2" size={20} />
            Esporta Database
          </button>
          
          {/* Backup Completo (Database + Immagini) */}
          <button 
            onClick={() => {
              // Crea un file ZIP con database e informazioni immagini
              const backupData = {
                products: products,
                images: products.map(p => ({
                  id: p.id,
                  name: p.name,
                  imagePath: p.image,
                  filename: p.image.split('/').pop()
                })),
                exportDate: new Date().toISOString(),
                totalProducts: products.length
              };
              
              const dataStr = JSON.stringify(backupData, null, 2);
              const dataBlob = new Blob([dataStr], { type: 'application/json' });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `filamentincantati_complete_backup_${new Date().toISOString().split('T')[0]}.json`;
              link.click();
              URL.revokeObjectURL(url);
              
              alert(`Backup completo esportato! Include database e riferimenti alle immagini.\n\nIMPORTANTE: Per un backup completo, copia anche la cartella /public/img/`);
            }}
            className="bg-pastel-aqua-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pastel-aqua-700 transition-colors flex items-center"
          >
            <Shield className="mr-2" size={20} />
            Backup Completo
          </button>
          
          {/* Import Database */}
          <label className="bg-pastel-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pastel-rose-700 transition-colors flex items-center cursor-pointer">
            <Upload className="mr-2" size={20} />
            Importa Database
            <input
              type="file"
              accept=".json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const importedProducts = JSON.parse(event.target?.result as string);
                      if (Array.isArray(importedProducts)) {
                        if (confirm(`Importare ${importedProducts.length} prodotti? Questo sostituirà i prodotti esistenti.`)) {
                          saveProducts(importedProducts);
                          alert(`Importati ${importedProducts.length} prodotti con successo!`);
                        }
                      } else {
                        alert('File non valido. Deve contenere un array di prodotti.');
                      }
                    } catch (error) {
                      alert('Errore nella lettura del file. Verifica che sia un JSON valido.');
                    }
                  };
                  reader.readAsText(file);
                }
                // Reset input
                e.target.value = '';
              }}
              className="hidden"
            />
          </label>
        </div>

        {/* Add/Edit Product Modal */}
        {(isAddingProduct || isEditingProduct) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-pastel-aqua-900">
                  {isEditingProduct ? 'Modifica Prodotto' : 'Aggiungi Prodotto'}
                </h2>
                <button onClick={() => {
                  setIsAddingProduct(false);
                  setIsEditingProduct(false);
                  setEditingProductId(null);
                  setNewProduct({ name: '', category: 'orecchini', image: '', materials: '', technique: '', price: '', description: '', isPublished: true });
                  setSelectedImage(null);
                  setImagePreview('');
                }} className="text-pastel-aqua-500 hover:text-pastel-aqua-700">
                  <X size={24} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">Nome Prodotto *</label>
                  <input type="text" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500" placeholder="Es. Luna d'Amalfi" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">Categoria *</label>
                  <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })} className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500">
                    <option value="orecchini">Orecchini</option>
                    <option value="collane">Collane</option>
                    <option value="bracciali">Bracciali</option>
                  </select>
                </div>

                {/* Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">Immagine Prodotto *</label>
                  <div className="border-2 border-dashed border-pastel-aqua-300 rounded-lg p-6 text-center hover:border-pastel-aqua-400 transition-colors">
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                    {!imagePreview ? (
                      <div>
                        <Upload className="mx-auto mb-4 text-pastel-aqua-400" size={48} />
                        <p className="text-pastel-aqua-700 mb-2"><strong>Carica un'immagine dal tuo device</strong></p>
                        <p className="text-sm text-pastel-aqua-600 mb-4">Clicca qui o trascina un'immagine (JPG, PNG, GIF - max 5MB)</p>
                        <button type="button" onClick={triggerFileInput} className="bg-pastel-aqua-600 text-white px-6 py-3 rounded-lg hover:bg-pastel-aqua-700 transition-colors">Seleziona Immagine</button>
                      </div>
                    ) : (
                      <div>
                        <div className="relative inline-block">
                          <img src={imagePreview} alt="Preview" className="max-w-full h-48 object-cover rounded-lg" />
                          <button type="button" onClick={() => { setSelectedImage(null); setImagePreview(''); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors">
                            <X size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-pastel-aqua-600 mt-2">{selectedImage?.name} ({(selectedImage?.size ? (selectedImage.size / 1024 / 1024).toFixed(2) : '0')} MB)</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-pastel-aqua-600 mb-2">Oppure inserisci un URL immagine:</p>
                    <input type="text" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500" placeholder="/img/nome-immagine.jpg" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">Prezzo *</label>
                  <input type="text" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500" placeholder="€45" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">Materiali *</label>
                  <input type="text" value={newProduct.materials} onChange={(e) => setNewProduct({ ...newProduct, materials: e.target.value })} className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500" placeholder="Perle di vetro, cotone cerato" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">Tecnica *</label>
                  <input type="text" value={newProduct.technique} onChange={(e) => setNewProduct({ ...newProduct, technique: e.target.value })} className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500" placeholder="Micro-macramè" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">Descrizione</label>
                  <textarea value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500" rows={3} placeholder="Descrizione opzionale del prodotto..." />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input type="checkbox" checked={newProduct.isPublished} onChange={(e) => setNewProduct({ ...newProduct, isPublished: e.target.checked })} className="mr-2" />
                    <span className="text-sm font-medium text-pastel-aqua-800">Pubblica immediatamente</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button onClick={() => {
                  setIsAddingProduct(false);
                  setIsEditingProduct(false);
                  setEditingProductId(null);
                  setNewProduct({ name: '', category: 'orecchini', image: '', materials: '', technique: '', price: '', description: '', isPublished: true });
                  setSelectedImage(null);
                  setImagePreview('');
                }} className="px-6 py-3 border border-pastel-aqua-300 text-pastel-aqua-700 rounded-lg hover:bg-pastel-aqua-50 transition-colors">Annulla</button>
                <button onClick={async () => {
                  if (!newProduct.name || !newProduct.materials || !newProduct.technique || !newProduct.price) { alert('Compila tutti i campi obbligatori'); return; }
                  let imagePath = newProduct.image || '';
                  if (selectedImage) {
                    setIsUploading(true);
                    try { imagePath = imagePreview; } catch (_) { alert('Errore nel caricamento'); setIsUploading(false); return; }
                    setIsUploading(false);
                  } else if (!newProduct.image) { alert('Seleziona un\'immagine o inserisci un URL'); return; }
                  
                  if (isEditingProduct && editingProductId) {
                    // Modifica prodotto esistente
                    const updatedProducts = products.map(p => 
                      p.id === editingProductId 
                        ? { ...p, name: newProduct.name!, category: newProduct.category!, image: imagePath, materials: newProduct.materials!, technique: newProduct.technique!, price: newProduct.price!, description: newProduct.description || '', isPublished: newProduct.isPublished || true }
                        : p
                    );
                    saveProducts(updatedProducts);
                    setIsEditingProduct(false);
                    setEditingProductId(null);
                  } else {
                    // Aggiungi nuovo prodotto
                    const product: Product = { id: Date.now().toString(), name: newProduct.name!, category: newProduct.category!, image: imagePath, materials: newProduct.materials!, technique: newProduct.technique!, price: newProduct.price!, description: newProduct.description || '', isPublished: newProduct.isPublished || true, createdAt: new Date().toISOString() };
                    const updatedProducts = [...products, product];
                    saveProducts(updatedProducts);
                  }
                  
                  setNewProduct({ name: '', category: 'orecchini', image: '', materials: '', technique: '', price: '', description: '', isPublished: true });
                  setSelectedImage(null);
                  setImagePreview('');
                  setIsAddingProduct(false);
                }} disabled={isUploading} className={`px-6 py-3 rounded-lg transition-colors ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-pastel-aqua-600 hover:bg-pastel-aqua-700 text-white'}`}>
                  {isUploading ? 'Caricamento...' : (isEditingProduct ? 'Salva Modifiche' : 'Aggiungi Prodotto')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-pastel-aqua-600 mb-2">{products.length}</div>
            <div className="text-pastel-aqua-700">Totale Prodotti</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{products.filter(p => p.isPublished).length}</div>
            <div className="text-green-700">Prodotti Visibili</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{products.filter(p => !p.isPublished).length}</div>
            <div className="text-orange-700">Prodotti Nascosti</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-pastel-sky-600 mb-2">{new Date().toLocaleDateString('it-IT')}</div>
            <div className="text-pastel-sky-700">Ultimo Aggiornamento</div>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-serif text-pastel-aqua-900 mb-6">Gestione Prodotti ({products.length})</h2>
          <div className="grid gap-6">
            {products.map((product) => (
              <div key={product.id} className="border border-pastel-aqua-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
                    <div>
                      <h3 className="text-lg font-semibold text-pastel-aqua-900">{product.name}</h3>
                      <p className="text-pastel-aqua-700">{product.category}</p>
                      <p className="text-pastel-aqua-600 font-semibold">{product.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => {
                        setEditingProductId(product.id);
                        setNewProduct({
                          name: product.name,
                          category: product.category,
                          image: product.image,
                          materials: product.materials,
                          technique: product.technique,
                          price: product.price,
                          description: product.description || '',
                          isPublished: product.isPublished
                        });
                        setImagePreview(product.image);
                        setIsEditingProduct(true);
                      }}
                      className="p-2 bg-pastel-aqua-100 text-pastel-aqua-600 rounded-lg hover:bg-pastel-aqua-200"
                      title="Modifica"
                    >
                      <Plus size={16} />
                    </button>
                    <button onClick={() => { const updated = products.map(p => p.id === product.id ? { ...p, isPublished: !p.isPublished } : p); saveProducts(updated); }} className={`p-2 rounded-lg ${product.isPublished ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={product.isPublished ? 'Nascondi' : 'Mostra'}>
                      {product.isPublished ? 'Visibile' : 'Nascosto'}
                    </button>
                    <button onClick={() => { if (confirm('Eliminare questo prodotto?')) { const updated = products.filter(p => p.id !== product.id); saveProducts(updated); } }} className="p-2 bg-pastel-rose-100 text-pastel-rose-600 rounded-lg hover:bg-pastel-rose-200" title="Elimina">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {product.description && (<div className="mt-2 text-sm text-pastel-aqua-700"><strong>Descrizione:</strong> {product.description}</div>)}
              </div>
            ))}
          </div>
          {products.length === 0 && (<div className="text-center py-12 text-pastel-aqua-700"><p>Nessun prodotto aggiunto. Clicca "Aggiungi Prodotto" per iniziare.</p></div>)}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 