import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Heart, Filter, Search, Grid, List, MessageCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  materials: string;
  technique: string;
  price: string;
  description: string;
  isPublished: boolean;
}

const AllProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('tutti');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const categories = [
    { id: 'tutti', name: 'Tutti i Pezzi' },
    { id: 'orecchini', name: 'Orecchini' },
    { id: 'collane', name: 'Collane' },
    { id: 'bracciali', name: 'Bracciali' },
    { id: 'anelli', name: 'Anelli' }
  ];

  // Carica prodotti pubblicati dall'API pubblica
  useEffect(() => {
    let cancelled = false;
    const loadFromApi = async () => {
      try {
        const res = await fetch('/api/products/public');
        if (!res.ok) throw new Error('HTTP');
        const data = await res.json();
        if (!cancelled) {
          setProducts(data);
          setFilteredProducts(data);
        }
      } catch (error) {
        console.error('Errore nel caricamento prodotti:', error);
        if (!cancelled) {
          setProducts([]);
          setFilteredProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadFromApi();
    return () => { cancelled = true; };
  }, []);

  // Filtra prodotti in base a categoria e ricerca
  useEffect(() => {
    let filtered = products;

    // Filtro per categoria
    if (selectedCategory !== 'tutti') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filtro per ricerca
    if (searchTerm.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.materials.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.technique.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-aqua-50 to-pastel-sky-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pastel-aqua-600 mx-auto mb-4"></div>
          <p className="text-pastel-aqua-700 text-lg">Caricamento collezione...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-aqua-50 to-pastel-sky-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToHome}
              className="flex items-center text-pastel-aqua-700 hover:text-pastel-aqua-900 transition-colors"
            >
              <ArrowLeft className="mr-2" size={20} />
              Torna alla Home
            </button>
            <h1 className="text-3xl font-serif text-pastel-aqua-900">Tutta la Collezione</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-pastel-aqua-100 text-pastel-aqua-700' 
                    : 'text-pastel-aqua-600 hover:bg-pastel-aqua-50'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-pastel-aqua-100 text-pastel-aqua-700' 
                    : 'text-pastel-aqua-600 hover:bg-pastel-aqua-50'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtri e Ricerca */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Ricerca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pastel-aqua-400" size={20} />
              <input
                type="text"
                placeholder="Cerca per nome, materiali, tecnica..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500 focus:border-transparent"
              />
            </div>

            {/* Filtro Categoria */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pastel-aqua-400" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500 focus:border-transparent appearance-none bg-white"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Contatore Prodotti */}
            <div className="flex items-center justify-center">
              <span className="text-pastel-aqua-700 font-medium">
                {filteredProducts.length} prodotto{filteredProducts.length !== 1 ? 'i' : ''} trovati
              </span>
            </div>
          </div>
        </div>

        {/* Prodotti */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="text-pastel-aqua-400 mb-4">
                <Search size={64} className="mx-auto" />
              </div>
              <h3 className="text-xl font-serif text-pastel-aqua-900 mb-2">Nessun prodotto trovato</h3>
              <p className="text-pastel-aqua-700 mb-6">
                Prova a modificare i filtri o i termini di ricerca
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('tutti');
                }}
                className="px-6 py-3 bg-pastel-aqua-600 text-white rounded-lg hover:bg-pastel-aqua-700 transition-colors"
              >
                Reset Filtri
              </button>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
          }>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
                onMouseEnter={() => setHoveredItem(product.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Immagine */}
                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full object-cover group-hover:scale-110 transition-transform duration-700 ${
                      viewMode === 'list' ? 'h-48' : 'h-80'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {hoveredItem === product.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex space-x-4">
                        <button className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors">
                          <Eye size={20} className="text-pastel-aqua-800" />
                        </button>
                        <button className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors">
                          <Heart size={20} className="text-pastel-red-500" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dettagli */}
                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-serif text-pastel-aqua-900">{product.name}</h3>
                    <span className="text-2xl font-bold text-pastel-aqua-700">{product.price}</span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-pastel-aqua-700 mb-4">
                    <p><strong>Materiali:</strong> {product.materials}</p>
                    <p><strong>Tecnica:</strong> {product.technique}</p>
                    {product.description && (
                      <p><strong>Descrizione:</strong> {product.description}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="bg-pastel-sky-100 text-pastel-aqua-800 px-3 py-1 rounded-full text-xs font-medium">
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </span>
                    <button className="text-pastel-aqua-600 hover:text-pastel-aqua-800 font-medium text-sm transition-colors">
                      Contatta per acquisto →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Pagina */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 inline-block">
            <p className="text-2xl font-serif text-pastel-aqua-900 mb-4">
              Interessato a un pezzo specifico?
            </p>
            <p className="text-pastel-aqua-700 mb-6">
              Contattami su WhatsApp per informazioni, personalizzazioni o acquisti
            </p>
            <a
              href="https://wa.me/393295381974?text=Ciao! Sono interessato/a ai gioielli Filamentincantati"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-pastel-aqua-600 text-white font-bold rounded-full hover:bg-pastel-aqua-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <MessageCircle className="mr-2" size={20} />
              Contatta su WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
