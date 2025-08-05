import React, { useState, useEffect } from 'react';
import { Eye, Heart, Sparkles, ArrowLeft } from 'lucide-react';

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
  const [selectedCategory, setSelectedCategory] = useState('tutti');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const categories = [
    { id: 'tutti', name: 'Tutti i Pezzi' },
    { id: 'orecchini', name: 'Orecchini' },
    { id: 'collane', name: 'Collane' },
    { id: 'bracciali', name: 'Bracciali' }
  ];

  useEffect(() => {
    const savedProducts = localStorage.getItem('filamentincantati_products');
    if (savedProducts) {
      const allProducts = JSON.parse(savedProducts);
      // Mostra solo i prodotti pubblicati
      const publishedProducts = allProducts.filter((p: Product) => p.isPublished);
      setProducts(publishedProducts);
    }
  }, []);

  const filteredProducts = selectedCategory === 'tutti' 
    ? products 
    : products.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-aqua-50 to-pastel-sky-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="flex items-center text-pastel-aqua-600 hover:text-pastel-aqua-800 transition-colors"
              >
                <ArrowLeft className="mr-2" size={20} />
                Torna al sito
              </a>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-serif text-pastel-aqua-900">Tutta la Collezione</h1>
              <p className="text-pastel-aqua-700">Filamentincantati</p>
            </div>
            <div className="w-32"></div> {/* Spacer per centrare il titolo */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="text-center mb-12">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-pastel-aqua-600 text-white shadow-lg'
                    : 'bg-pastel-sky-100 text-pastel-aqua-800 hover:bg-pastel-sky-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="text-pastel-aqua-600 mr-3" size={24} />
              <h2 className="text-xl font-serif text-pastel-aqua-900">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'pezzo' : 'pezzi'} disponibili
              </h2>
            </div>
            <p className="text-pastel-aqua-700">
              Ogni gioiello è unico e numerato. Contattaci per informazioni su disponibilità e personalizzazioni.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {hoveredItem === item.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex space-x-4">
                      <button className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors">
                        <Eye size={20} className="text-pastel-aqua-800" />
                      </button>
                      <button className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors">
                        <Heart size={20} className="text-pastel-rose-500" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-serif text-pastel-aqua-900">{item.name}</h3>
                  <span className="text-2xl font-bold text-pastel-aqua-700">{item.price}</span>
                </div>
                
                <div className="space-y-2 text-sm text-pastel-aqua-700 mb-4">
                  <p><strong>Materiali:</strong> {item.materials}</p>
                  <p><strong>Tecnica:</strong> {item.technique}</p>
                  {item.description && (
                    <p className="text-pastel-aqua-600 italic">{item.description}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="bg-pastel-sky-100 text-pastel-aqua-800 px-3 py-1 rounded-full text-xs font-medium">
                    Pezzo Unico
                  </span>
                  <a
                    href={`https://wa.me/393295381974?text=Ciao! Sono interessata al gioiello "${item.name}" (${item.price})`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pastel-aqua-600 hover:text-pastel-aqua-800 font-medium text-sm transition-colors"
                  >
                    Richiedi info →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <Sparkles className="text-pastel-aqua-400 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-serif text-pastel-aqua-900 mb-2">
                Nessun prodotto disponibile
              </h3>
              <p className="text-pastel-aqua-700 mb-6">
                Al momento non ci sono prodotti in questa categoria. Controlla le altre categorie o contattaci per informazioni.
              </p>
              <button
                onClick={() => setSelectedCategory('tutti')}
                className="bg-pastel-aqua-600 text-white px-6 py-3 rounded-lg hover:bg-pastel-aqua-700 transition-colors"
              >
                Vedi tutti i prodotti
              </button>
            </div>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg inline-block">
            <h3 className="text-2xl font-serif text-pastel-aqua-900 mb-4">
              Non trovi quello che cerchi?
            </h3>
            <p className="text-pastel-aqua-700 mb-6 max-w-md">
              Possiamo creare pezzi personalizzati su misura per te. Contattaci per discutere le tue idee!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/393295381974"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Contattaci su WhatsApp
              </a>
              <a
                href="mailto:filamentincantati@gmail.com"
                className="bg-pastel-aqua-600 text-white px-6 py-3 rounded-lg hover:bg-pastel-aqua-700 transition-colors font-semibold"
              >
                Invia Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts; 