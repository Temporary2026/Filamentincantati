import React, { useState, useEffect } from 'react';
import { Filter, Search, Eye, Heart, ShoppingBag } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

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

const AllProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('tutti');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(
          collection(db, 'products'),
          where('isPublished', '==', true),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const prods: Product[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          prods.push({ ...(data as Product), id: docSnap.id });
        });
        setProducts(prods);
        setFilteredProducts(prods);
      } catch (error) {
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filtra e ordina prodotti
  useEffect(() => {
    let filtered = products;
    if (selectedCategory !== 'tutti') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.materials.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.technique.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = parseFloat(a.price.replace(/[^\d.,]/g, '').replace(',', '.'));
          bValue = parseFloat(b.price.replace(/[^\d.,]/g, '').replace(',', '.'));
          break;
        case 'date':
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm, sortBy, sortOrder]);

  const categories = [
    { id: 'tutti', name: 'Tutti i Pezzi', count: products.length },
    { id: 'orecchini', name: 'Orecchini', count: products.filter(p => p.category === 'orecchini').length },
    { id: 'collane', name: 'Collane', count: products.filter(p => p.category === 'collane').length },
    { id: 'bracciali', name: 'Bracciali', count: products.filter(p => p.category === 'bracciali').length }
  ];

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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-pastel-aqua-900 mb-4">Tutta la Collezione</h1>
          <p className="text-xl text-pastel-aqua-700 max-w-3xl mx-auto">
            Scopri tutti i nostri gioielli artigianali, creati con passione e materiali di qualità
          </p>
        </div>

        {/* Filtri e Ricerca */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Ricerca */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">Cerca prodotti</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pastel-aqua-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nome, materiali, tecnica..."
                  className="w-full pl-10 pr-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">Categoria</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Ordinamento */}
            <div>
              <label className="block text-sm font-medium text-pastel-aqua-800 mb-2">Ordina per</label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-') as [any, any];
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
                className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg focus:ring-2 focus:ring-pastel-aqua-500 focus:border-transparent"
              >
                <option value="date-desc">Più recenti</option>
                <option value="date-asc">Meno recenti</option>
                <option value="name-asc">Nome A-Z</option>
                <option value="name-desc">Nome Z-A</option>
                <option value="price-asc">Prezzo crescente</option>
                <option value="price-desc">Prezzo decrescente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistiche */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-pastel-aqua-600 mb-2">{filteredProducts.length}</div>
            <div className="text-pastel-aqua-700">Prodotti Trovati</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{products.filter(p => p.category === 'orecchini').length}</div>
            <div className="text-green-700">Orecchini</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-pastel-sky-600 mb-2">{products.filter(p => p.category === 'collane').length}</div>
            <div className="text-pastel-sky-700">Collane</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-pastel-rose-600 mb-2">{products.filter(p => p.category === 'bracciali').length}</div>
            <div className="text-pastel-rose-700">Bracciali</div>
          </div>
        </div>

        {/* Griglia Prodotti */}
        {filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-square overflow-hidden relative group">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  {/* Overlay azioni (solo icone, nessun link admin) */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex space-x-3">
                      <button className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg">
                        <Eye size={20} className="text-pastel-aqua-800" />
                      </button>
                      <button className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg">
                        <Heart size={20} className="text-pastel-rose-500" />
                      </button>
                      <button className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg">
                        <ShoppingBag size={20} className="text-pastel-aqua-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-serif text-pastel-aqua-900 leading-tight">{product.name}</h3>
                    <span className="text-xl font-bold text-pastel-aqua-600">{product.price}</span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-pastel-aqua-700 mb-4">
                    <p><strong>Materiali:</strong> {product.materials}</p>
                    <p><strong>Tecnica:</strong> {product.technique}</p>
                  </div>

                  {product.description && (
                    <p className="text-pastel-aqua-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="bg-pastel-sky-100 text-pastel-aqua-800 px-3 py-1 rounded-full text-xs font-medium capitalize">
                      {product.category}
                    </span>
                    <span className="text-xs text-pastel-aqua-500">
                      {new Date(product.createdAt).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-serif text-pastel-aqua-900 mb-2">Nessun prodotto trovato</h3>
              <p className="text-pastel-aqua-700 mb-6">
                Prova a modificare i filtri di ricerca o torna più tardi.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-pastel-aqua-700 italic text-lg mb-6">
              Ogni pezzo è unico e realizzato a mano con amore e dedizione.
            </p>
            <a
              href="/"
              className="inline-flex items-center bg-pastel-aqua-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-pastel-aqua-700 transition-colors"
            >
              Torna alla Home
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
