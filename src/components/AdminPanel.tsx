import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Plus, Trash2, X, Shield, Upload, Mail, Key, QrCode, AlertTriangle } from 'lucide-react';

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

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
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
  
  // Image upload states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Authentication states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showGoogleAuthSetup, setShowGoogleAuthSetup] = useState(false);
  const [showFirstTimeSetup, setShowFirstTimeSetup] = useState(false);

  // Updated credentials
  const ADMIN_PASSWORD = 'Filamentincantati2025!!@';
  
  // Predefined secret key for Google Authenticator (CHANGE THIS IN PRODUCTION!)
  const PREDEFINED_SECRET = 'JBSWY3DPEHPK3PXP'; // This is a sample key - CHANGE IT!
  
  // Check if Google Auth is configured
  const isGoogleAuthConfigured = () => {
    return localStorage.getItem('filamentincantati_google_auth_configured') === 'true';
  };

  // Check TOTP status from server
  const checkTOTPStatus = async () => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/totp/status/orarytempation2026@gmail.com' 
        : 'http://localhost:3001/api/totp/status/orarytempation2026@gmail.com';
        
      const response = await fetch(apiUrl);
      if (response.ok) {
        const result = await response.json();
        if (result.configured) {
          localStorage.setItem('filamentincantati_google_auth_configured', 'true');
          return true;
        }
      }
    } catch (error) {
      console.error('Error checking TOTP status:', error);
    }
    return false;
  };

  // Check if this is first time login
  const isFirstTimeLogin = () => {
    return localStorage.getItem('filamentincantati_first_login') === null;
  };

  // Google Authenticator validation (REAL implementation)
  const validateGoogleAuthenticator = async (code: string): Promise<boolean> => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/totp/verify' 
        : 'http://localhost:3001/api/totp/verify';
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account: 'orarytempation2026@gmail.com',
          token: code
        }),
      });

      if (!response.ok) {
        console.error('Error verifying TOTP:', response.statusText);
        return false;
      }

      const result = await response.json();
      return result.verified;
    } catch (error) {
      console.error('Error validating TOTP:', error);
      return false;
    }
  };

  const handleLogin = async () => {
    if (password !== ADMIN_PASSWORD) {
      alert('Password non valida');
      return;
    }

    // First time login - allow any 6-digit code
    if (isFirstTimeLogin()) {
      if (twoFactorCode.length === 6 && /^\d{6}$/.test(twoFactorCode)) {
        localStorage.setItem('filamentincantati_first_login', 'completed');
        setShowFirstTimeSetup(true);
        return;
      } else {
        alert('Inserisci un codice di 6 cifre per il primo accesso');
        return;
      }
    }

    // Subsequent logins - require Google Authenticator
    if (!isGoogleAuthConfigured()) {
      alert('Google Authenticator non è configurato. Configuralo prima di accedere.');
      setShowGoogleAuthSetup(true);
      return;
    }

    const isValid = await validateGoogleAuthenticator(twoFactorCode);
    if (isValid) {
      setIsAuthenticated(true);
      loadProducts();
    } else {
      alert('Codice Google Authenticator non valido. Verifica il codice e riprova.');
    }
  };

  const handleFirstTimeSetup = async () => {
    try {
      // Generate new TOTP secret from server
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/totp/generate' 
        : 'http://localhost:3001/api/totp/generate';
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account: 'orarytempation2026@gmail.com',
          issuer: 'Filamentincantati_controlPanel'
        }),
      });

      if (!response.ok) {
        alert('Errore nella generazione del segreto TOTP');
        return;
      }

      const result = await response.json();
      
      // Store the secret and mark as configured
      localStorage.setItem('filamentincantati_google_auth_secret', result.secret);
      localStorage.setItem('filamentincantati_google_auth_configured', 'true');
      localStorage.setItem('filamentincantati_qr_code', result.qrCode);
      
      setShowFirstTimeSetup(false);
      setShowGoogleAuthSetup(true);
    } catch (error) {
      console.error('Error setting up TOTP:', error);
      alert('Errore nella configurazione di Google Authenticator');
    }
  };

  const handleForgotPassword = () => {
    if (resetEmail === 'filamentincantati@gmail.com') {
      alert('Link di recupero password inviato a filamentincantati@gmail.com');
      setShowForgotPassword(false);
      setShowResetPassword(true);
    } else {
      alert('Email non riconosciuta. Usa filamentincantati@gmail.com');
    }
  };

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Le password non coincidono');
      return;
    }
    if (newPassword.length < 8) {
      alert('La password deve essere di almeno 8 caratteri');
      return;
    }
    // In a real implementation, this would update the password in the database
    alert('Password aggiornata con successo');
    setShowResetPassword(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  const loadProducts = () => {
    const savedProducts = localStorage.getItem('filamentincantati_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  };

  const saveProducts = (updatedProducts: Product[]) => {
    localStorage.setItem('filamentincantati_products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
  };

  // Image upload functions
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Seleziona solo file immagine (JPG, PNG, GIF, etc.)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'immagine deve essere inferiore a 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    
    try {
      // Create FormData
      const formData = new FormData();
      formData.append('image', file);
      
      // Send to server
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/upload-image' 
        : 'http://localhost:3001/api/upload-image';
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Errore nel caricamento');
      }
      
      const result = await response.json();
      console.log('Upload successful:', result);
      
      return result.path;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error(error instanceof Error ? error.message : 'Errore nel caricamento dell\'immagine');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.materials || !newProduct.technique || !newProduct.price) {
      alert('Compila tutti i campi obbligatori');
      return;
    }

    // Handle image upload if selected
    let imagePath = newProduct.image || '';
    if (selectedImage) {
      try {
        imagePath = await uploadImage(selectedImage);
      } catch (error) {
        alert('Errore nel caricamento dell\'immagine. Riprova.');
        return;
      }
    } else if (!newProduct.image) {
      alert('Seleziona un\'immagine o inserisci un URL');
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name!,
      category: newProduct.category!,
      image: imagePath,
      materials: newProduct.materials!,
      technique: newProduct.technique!,
      price: newProduct.price!,
      description: newProduct.description || '',
      isPublished: newProduct.isPublished || true,
      createdAt: new Date().toISOString()
    };

    const updatedProducts = [...products, product];
    saveProducts(updatedProducts);
    
    // Reset form
    setNewProduct({
      name: '',
      category: 'orecchini',
      image: '',
      materials: '',
      technique: '',
      price: '',
      description: '',
      isPublished: true
    });
    setSelectedImage(null);
    setImagePreview('');
    setIsAddingProduct(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      const updatedProducts = products.filter(p => p.id !== id);
      saveProducts(updatedProducts);
    }
  };

  const toggleProductVisibility = (id: string) => {
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, isPublished: !p.isPublished } : p
    );
    saveProducts(updatedProducts);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Check TOTP status on component mount
  useEffect(() => {
    const checkStatus = async () => {
      await checkTOTPStatus();
    };
    checkStatus();
  }, []);

  // First Time Setup Form
  if (showFirstTimeSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-aqua-50 to-pastel-sky-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-pastel-aqua-100 rounded-full mb-4">
              <AlertTriangle className="text-pastel-aqua-600" size={32} />
            </div>
            <h1 className="text-2xl font-serif text-pastel-aqua-900 mb-2">Primo Accesso</h1>
            <p className="text-pastel-aqua-700">Configura Google Authenticator per la sicurezza</p>
          </div>

          <div className="space-y-6">
            <div className="bg-pastel-sky-50 p-4 rounded-lg">
              <h3 className="font-semibold text-pastel-aqua-900 mb-2">⚠️ Importante:</h3>
              <p className="text-sm text-pastel-aqua-700">
                Questo è il tuo primo accesso. Per motivi di sicurezza, devi configurare Google Authenticator 
                prima di poter utilizzare il pannello di amministrazione.
              </p>
            </div>

            <div className="bg-pastel-aqua-50 p-4 rounded-lg">
              <h3 className="font-semibold text-pastel-aqua-900 mb-2">Prossimi Passi:</h3>
              <ol className="text-sm text-pastel-aqua-700 space-y-1">
                <li>1. Clicca "Configura Google Authenticator"</li>
                <li>2. Scansiona il QR code con la tua app</li>
                <li>3. Verifica la configurazione</li>
                <li>4. Accedi con i codici generati</li>
              </ol>
            </div>

            <button
              onClick={handleFirstTimeSetup}
              className="w-full bg-pastel-aqua-600 text-white py-3 rounded-lg font-semibold hover:bg-pastel-aqua-700 transition-colors"
            >
              Configura Google Authenticator
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Google Authenticator Setup Form
  if (showGoogleAuthSetup) {
    const secret = localStorage.getItem('filamentincantati_google_auth_secret') || PREDEFINED_SECRET;
    const qrCode = localStorage.getItem('filamentincantati_qr_code');

    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-aqua-50 to-pastel-sky-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-pastel-aqua-100 rounded-full mb-4">
              <QrCode className="text-pastel-aqua-600" size={32} />
            </div>
            <h1 className="text-2xl font-serif text-pastel-aqua-900 mb-2">Configura Google Authenticator</h1>
            <p className="text-pastel-aqua-700">Scansiona il QR code o inserisci manualmente la chiave</p>
          </div>

          <div className="space-y-6">
            {/* QR Code */}
            <div className="text-center">
              <div className="bg-gray-100 p-4 rounded-lg inline-block">
                <div className="text-xs text-gray-500 mb-2">QR Code per Google Authenticator</div>
                <div className="bg-white p-4 rounded border">
                  {qrCode ? (
                    <img 
                      src={qrCode} 
                      alt="QR Code" 
                      className="w-48 h-48 mx-auto"
                    />
                  ) : (
                    <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                      <QrCode size={64} />
                      <div className="text-center">
                        <div className="text-sm">QR Code</div>
                        <div className="text-xs">(Caricamento...)</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Manual Setup */}
            <div>
              <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">
                Chiave Segreta (per inserimento manuale)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={secret}
                  readOnly
                  className="flex-1 px-4 py-3 border border-pastel-aqua-200 rounded-lg bg-gray-50 text-sm font-mono"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(secret)}
                  className="px-4 py-3 bg-pastel-aqua-600 text-white rounded-lg hover:bg-pastel-aqua-700 transition-colors"
                >
                  Copia
                </button>
              </div>
              <p className="text-xs text-pastel-aqua-600 mt-1">
                Usa questa chiave se non riesci a scansionare il QR code
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-pastel-sky-50 p-4 rounded-lg">
              <h3 className="font-semibold text-pastel-aqua-900 mb-2">Istruzioni:</h3>
              <ol className="text-sm text-pastel-aqua-700 space-y-1">
                <li>1. Scarica Google Authenticator dal tuo app store</li>
                <li>2. Apri l'app e seleziona "Scansiona codice QR"</li>
                <li>3. Scansiona il QR code sopra o inserisci manualmente la chiave</li>
                <li>4. L'app genererà codici di 6 cifre ogni 30 secondi</li>
                <li>5. Usa questi codici per accedere al pannello admin</li>
              </ol>
            </div>

            <button
              onClick={() => {
                setShowGoogleAuthSetup(false);
                setIsAuthenticated(true);
                loadProducts();
              }}
              className="w-full bg-pastel-aqua-600 text-white py-3 rounded-lg font-semibold hover:bg-pastel-aqua-700 transition-colors"
            >
              Ho Configurato Google Authenticator
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Reset Password Form
  if (showResetPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-aqua-50 to-pastel-sky-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-pastel-aqua-100 rounded-full mb-4">
              <Key className="text-pastel-aqua-600" size={32} />
            </div>
            <h1 className="text-2xl font-serif text-pastel-aqua-900 mb-2">Reset Password</h1>
            <p className="text-pastel-aqua-700">Inserisci la nuova password</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">
                Nuova Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500 focus:border-transparent"
                  placeholder="Inserisci la nuova password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pastel-aqua-500 hover:text-pastel-aqua-700"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">
                Conferma Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500 focus:border-transparent"
                  placeholder="Conferma la nuova password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pastel-aqua-500 hover:text-pastel-aqua-700"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleResetPassword}
              className="w-full bg-pastel-aqua-600 text-white py-3 rounded-lg font-semibold hover:bg-pastel-aqua-700 transition-colors"
            >
              Aggiorna Password
            </button>

            <button
              onClick={() => setShowResetPassword(false)}
              className="w-full px-4 py-3 border border-pastel-aqua-300 text-pastel-aqua-700 rounded-lg hover:bg-pastel-aqua-50 transition-colors"
            >
              Annulla
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Forgot Password Form
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-aqua-50 to-pastel-sky-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-pastel-aqua-100 rounded-full mb-4">
              <Mail className="text-pastel-aqua-600" size={32} />
            </div>
            <h1 className="text-2xl font-serif text-pastel-aqua-900 mb-2">Recupero Password</h1>
            <p className="text-pastel-aqua-700">Inserisci la tua email per ricevere il link di reset</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">
                Email
              </label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500 focus:border-transparent"
                placeholder="filamentincantati@gmail.com"
              />
            </div>

            <button
              onClick={handleForgotPassword}
              className="w-full bg-pastel-aqua-600 text-white py-3 rounded-lg font-semibold hover:bg-pastel-aqua-700 transition-colors"
            >
              Invia Link di Reset
            </button>

            <button
              onClick={() => setShowForgotPassword(false)}
              className="w-full px-4 py-3 border border-pastel-aqua-300 text-pastel-aqua-700 rounded-lg hover:bg-pastel-aqua-50 transition-colors"
            >
              Torna al Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Login Form
  if (!isAuthenticated) {
    const isFirstTime = isFirstTimeLogin();
    const isConfigured = isGoogleAuthConfigured();

    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-aqua-50 to-pastel-sky-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-pastel-aqua-100 rounded-full mb-4">
              <Shield className="text-pastel-aqua-600" size={32} />
            </div>
            <h1 className="text-2xl font-serif text-pastel-aqua-900 mb-2">Admin Panel</h1>
            <p className="text-pastel-aqua-700">Filamentincantati - Gestione Collezione</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div>
              <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">
                {isFirstTime ? 'Codice di Accesso (Prima Volta)' : 'Codice Google Authenticator'}
              </label>
              <input
                type="text"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500 focus:border-transparent"
                placeholder={isFirstTime ? "Inserisci qualsiasi codice di 6 cifre" : "Inserisci il codice 2FA"}
                maxLength={6}
              />
              <p className="text-xs text-pastel-aqua-600 mt-1">
                {isFirstTime 
                  ? "Per il primo accesso, inserisci qualsiasi codice di 6 cifre"
                  : "Apri Google Authenticator e inserisci il codice di 6 cifre"
                }
              </p>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-pastel-aqua-600 text-white py-3 rounded-lg font-semibold hover:bg-pastel-aqua-700 transition-colors"
            >
              Accedi
            </button>

            <div className="flex space-x-2">
              {!isFirstTime && !isConfigured && (
                <button
                  onClick={() => setShowGoogleAuthSetup(true)}
                  className="flex-1 px-4 py-3 border border-pastel-aqua-300 text-pastel-aqua-700 rounded-lg hover:bg-pastel-aqua-50 transition-colors text-sm"
                >
                  Configura Google Auth
                </button>
              )}
              <button
                onClick={() => setShowForgotPassword(true)}
                className="flex-1 px-4 py-3 text-pastel-aqua-600 hover:text-pastel-aqua-800 transition-colors text-sm"
              >
                Password dimenticata?
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-pastel-rose-500 text-white rounded-lg hover:bg-pastel-rose-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Add Product Button */}
        <div className="mb-8">
          <button
            onClick={() => setIsAddingProduct(true)}
            className="bg-pastel-aqua-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pastel-aqua-700 transition-colors flex items-center"
          >
            <Plus className="mr-2" size={20} />
            Aggiungi Prodotto
          </button>
        </div>

        {/* Add Product Modal */}
        {isAddingProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-pastel-aqua-900">Aggiungi Prodotto</h2>
                <button
                  onClick={() => setIsAddingProduct(false)}
                  className="text-pastel-aqua-500 hover:text-pastel-aqua-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">
                    Nome Prodotto *
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500"
                    placeholder="Es. Luna d'Amalfi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">
                    Categoria *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value as any})}
                    className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500"
                  >
                    <option value="orecchini">Orecchini</option>
                    <option value="collane">Collane</option>
                    <option value="bracciali">Bracciali</option>
                  </select>
                </div>

                {/* Image Upload Section */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">
                    Immagine Prodotto *
                  </label>
                  
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-pastel-aqua-300 rounded-lg p-6 text-center hover:border-pastel-aqua-400 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    
                    {!imagePreview ? (
                      <div>
                        <Upload className="mx-auto mb-4 text-pastel-aqua-400" size={48} />
                        <p className="text-pastel-aqua-700 mb-2">
                          <strong>Carica un'immagine dal tuo device</strong>
                        </p>
                        <p className="text-sm text-pastel-aqua-600 mb-4">
                          Clicca qui o trascina un'immagine (JPG, PNG, GIF - max 5MB)
                        </p>
                        <button
                          type="button"
                          onClick={triggerFileInput}
                          className="bg-pastel-aqua-600 text-white px-6 py-3 rounded-lg hover:bg-pastel-aqua-700 transition-colors"
                        >
                          Seleziona Immagine
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedImage(null);
                              setImagePreview('');
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-pastel-aqua-600 mt-2">
                          {selectedImage?.name} ({(selectedImage?.size ? (selectedImage.size / 1024 / 1024).toFixed(2) : '0')} MB)
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Alternative URL Input */}
                  <div className="mt-4">
                    <p className="text-sm text-pastel-aqua-600 mb-2">Oppure inserisci un URL immagine:</p>
                    <input
                      type="text"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                      className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500"
                      placeholder="/img/nome-immagine.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">
                    Prezzo *
                  </label>
                  <input
                    type="text"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500"
                    placeholder="€45"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">
                    Materiali *
                  </label>
                  <input
                    type="text"
                    value={newProduct.materials}
                    onChange={(e) => setNewProduct({...newProduct, materials: e.target.value})}
                    className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500"
                    placeholder="Perle di vetro, cotone cerato"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">
                    Tecnica *
                  </label>
                  <input
                    type="text"
                    value={newProduct.technique}
                    onChange={(e) => setNewProduct({...newProduct, technique: e.target.value})}
                    className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500"
                    placeholder="Micro-macramè"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">
                    Descrizione
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500"
                    rows={3}
                    placeholder="Descrizione opzionale del prodotto..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newProduct.isPublished}
                      onChange={(e) => setNewProduct({...newProduct, isPublished: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-pastel-aqua-800">
                      Pubblica immediatamente
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setIsAddingProduct(false)}
                  className="px-6 py-3 border border-pastel-aqua-300 text-pastel-aqua-700 rounded-lg hover:bg-pastel-aqua-50 transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={handleAddProduct}
                  disabled={isUploading}
                  className={`px-6 py-3 rounded-lg transition-colors ${
                    isUploading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-pastel-aqua-600 hover:bg-pastel-aqua-700 text-white'
                  }`}
                >
                  {isUploading ? 'Caricamento...' : 'Aggiungi Prodotto'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-serif text-pastel-aqua-900 mb-6">Prodotti ({products.length})</h2>
          
          <div className="grid gap-6">
            {products.map((product) => (
              <div key={product.id} className="border border-pastel-aqua-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-pastel-aqua-900">{product.name}</h3>
                      <p className="text-pastel-aqua-700">{product.category}</p>
                      <p className="text-pastel-aqua-600 font-semibold">{product.price}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleProductVisibility(product.id)}
                      className={`p-2 rounded-lg ${
                        product.isPublished 
                          ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={product.isPublished ? 'Nascondi' : 'Mostra'}
                    >
                      {product.isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 bg-pastel-rose-100 text-pastel-rose-600 rounded-lg hover:bg-pastel-rose-200"
                      title="Elimina"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Materiali:</strong> {product.materials}
                  </div>
                  <div>
                    <strong>Tecnica:</strong> {product.technique}
                  </div>
                </div>
                
                {product.description && (
                  <div className="mt-2 text-sm text-pastel-aqua-700">
                    <strong>Descrizione:</strong> {product.description}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {products.length === 0 && (
            <div className="text-center py-12 text-pastel-aqua-700">
              <p>Nessun prodotto aggiunto. Clicca "Aggiungi Prodotto" per iniziare.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 