import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Plus, Trash2, X, Shield, Upload, Download, Cloud, RefreshCw } from 'lucide-react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword } from 'firebase/auth';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';

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

const ADMIN_EMAIL = 'liguori.daniela87@gmail.com'; // Cambia con la tua email admin registrata su Firebase

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
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
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [changePasswordMsg, setChangePasswordMsg] = useState('');

  // Carica prodotti da Firestore
  const loadProducts = async () => {
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const products: Product[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        products.push({ ...(data as Product), id: docSnap.id });
      });
      setProducts(products);
    } catch (error) {
      setErrorMsg('Errore caricamento prodotti');
    }
  };

  // Login admin con Firebase Auth
  const handleLogin = async () => {
    setErrorMsg('');
    try {
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
      setIsAuthenticated(true);
      setPassword('');
      await loadProducts();
    } catch (error) {
      setErrorMsg('Credenziali non valide');
    }
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
    setProducts([]);
  };

  // Cambia password admin
  const handleChangePassword = async () => {
    setChangePasswordMsg('');
    if (newPassword.length < 8) {
      setChangePasswordMsg('La password deve essere di almeno 8 caratteri');
      return;
    }
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setChangePasswordMsg('Password aggiornata con successo!');
        setShowChangePassword(false);
        setNewPassword('');
      }
    } catch (error) {
      setChangePasswordMsg('Errore aggiornamento password');
    }
  };

  // CRUD prodotti su Firestore
  const saveProduct = async (product: Product) => {
    if (product.id) {
      // Update
      const ref = doc(db, 'products', product.id);
      await updateDoc(ref, { ...product });
    } else {
      // Add
      await addDoc(collection(db, 'products'), { ...product });
    }
    await loadProducts();
  };

  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
    await loadProducts();
  };

  // Gestione immagini locale (solo preview, non upload su Firebase Storage)
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) { alert('Seleziona solo file immagine'); return; }
      if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return; }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };
  const triggerFileInput = () => fileInputRef.current?.click();

  // Auth state listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && user.email === ADMIN_EMAIL) {
        setIsAuthenticated(true);
        loadProducts();
      } else if (user) {
        setIsAuthenticated(false);
        setErrorMsg('Accesso negato: solo l\'amministratore può gestire i prodotti.');
      } else {
        setIsAuthenticated(false);
      }
    });
    return () => unsub();
  }, []);

  // UI: Login admin
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-aqua-50 to-pastel-sky-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-pastel-aqua-100 rounded-full mb-4">
              <Shield className="text-pastel-aqua-600" size={32} />
            </div>
            <h1 className="text-2xl font-serif text-pastel-aqua-900 mb-2">Admin Panel</h1>
            <p className="text-pastel-aqua-700">Accesso amministratore</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleLogin()}
                  className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500 focus:border-transparent" 
                  placeholder="Inserisci la password" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pastel-aqua-500 hover:text-pastel-aqua-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}
            <button 
              onClick={handleLogin} 
              className="w-full bg-pastel-aqua-600 text-white py-3 rounded-lg font-semibold hover:bg-pastel-aqua-700 transition-colors"
            >
              Accedi
            </button>
            {errorMsg && (
              <button onClick={handleLogout} className="w-full mt-2 bg-pastel-rose-500 text-white py-2 rounded-lg font-semibold hover:bg-pastel-rose-600 transition-colors">Logout</button>
            )}
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
            <div className="flex gap-2">
              <button onClick={() => setShowChangePassword(true)} className="px-4 py-2 bg-pastel-sky-500 text-white rounded-lg hover:bg-pastel-sky-600 transition-colors">Cambia Password</button>
              <button onClick={handleLogout} className="px-4 py-2 bg-pastel-rose-500 text-white rounded-lg hover:bg-pastel-rose-600 transition-colors">Logout</button>
            </div>
          </div>
        </div>

        {/* Cambia password modal */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md">
              <h2 className="text-xl font-serif mb-4">Cambia Password</h2>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg mb-4" placeholder="Nuova password" />
              {changePasswordMsg && <div className="mb-2 text-sm text-pastel-aqua-700">{changePasswordMsg}</div>}
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowChangePassword(false)} className="px-4 py-2 border border-pastel-aqua-300 text-pastel-aqua-700 rounded-lg">Annulla</button>
                <button onClick={handleChangePassword} className="px-4 py-2 bg-pastel-aqua-600 text-white rounded-lg hover:bg-pastel-aqua-700">Aggiorna</button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button onClick={() => setIsAddingProduct(true)} className="bg-pastel-aqua-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pastel-aqua-700 transition-colors flex items-center">
            <Plus className="mr-2" size={20} />
            Aggiungi Prodotto
          </button>
        </div>

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
                  if (!newProduct.name || !newProduct.materials || !newProduct.technique || !newProduct.price) { 
                    alert('Compila tutti i campi obbligatori'); 
                    return; 
                  }
                  let imagePath = newProduct.image || '';
                  if (selectedImage) {
                    imagePath = imagePreview;
                  } else if (!newProduct.image) { 
                    alert('Seleziona un\'immagine o inserisci un URL'); 
                    return; 
                  }
                  try {
                    const product: Product = {
                      id: isEditingProduct && editingProductId ? editingProductId : '',
                      name: newProduct.name!,
                      category: newProduct.category!,
                      image: imagePath,
                      materials: newProduct.materials!,
                      technique: newProduct.technique!,
                      price: newProduct.price!,
                      description: newProduct.description || '',
                      isPublished: newProduct.isPublished ?? true,
                      createdAt: new Date().toISOString()
                    };
                    await saveProduct(product);
                    setIsAddingProduct(false);
                    setIsEditingProduct(false);
                    setEditingProductId(null);
                    setNewProduct({ name: '', category: 'orecchini', image: '', materials: '', technique: '', price: '', description: '', isPublished: true });
                    setSelectedImage(null);
                    setImagePreview('');
                    alert('Prodotto salvato con successo!');
                  } catch (error) {
                    alert('Errore nel salvataggio');
                  }
                }} disabled={isUploading} className={`px-6 py-3 rounded-lg transition-colors ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-pastel-aqua-600 hover:bg-pastel-aqua-700 text-white'}`}>
                  {isUploading ? 'Caricamento...' : (isEditingProduct ? 'Salva Modifiche' : 'Aggiungi Prodotto')}
                </button>
              </div>
            </div>
          </div>
        )}

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
                    <button onClick={async () => { 
                      try {
                        const updated = { ...product, isPublished: !product.isPublished };
                        await saveProduct(updated as Product);
                      } catch (error) {
                        alert('Errore nell\'aggiornamento');
                      }
                    }} className={`p-2 rounded-lg ${product.isPublished ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={product.isPublished ? 'Nascondi' : 'Mostra'}>
                      {product.isPublished ? 'Visibile' : 'Nascosto'}
                    </button>
                    <button onClick={async () => { 
                      if (confirm('Eliminare questo prodotto?')) { 
                        try {
                          await deleteProduct(product.id);
                        } catch (error) {
                          alert('Errore nell\'eliminazione');
                        }
                      } 
                    }} className="p-2 bg-pastel-rose-100 text-pastel-rose-600 rounded-lg hover:bg-pastel-rose-200" title="Elimina">
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