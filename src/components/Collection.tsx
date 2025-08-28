import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

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

const Collection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Carica prodotti dal localStorage
  useEffect(() => {
    try {
      // Prova prima il nuovo formato
      const savedProducts = localStorage.getItem('filamentincantati_products_v2');
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts);
        const publishedProducts = parsedProducts.filter((p: Product) => p.isPublished);
        setProducts(publishedProducts);
        setLoading(false);
        return;
      }
      
      // Fallback al vecchio formato
      const oldProducts = localStorage.getItem('filamentincantati_products');
      if (oldProducts) {
        const parsedOld = JSON.parse(oldProducts);
        const publishedProducts = parsedOld.filter((p: Product) => p.isPublished);
        setProducts(publishedProducts);
        setLoading(false);
        return;
      }
      
      // Nessun prodotto trovato
      setProducts([]);
      setLoading(false);
    } catch (error) {
      console.error('Errore caricamento prodotti:', error);
      setProducts([]);
      setLoading(false);
    }
  }, []);

  // Ascolta cambiamenti nel localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'filamentincantati_products_v2' && e.newValue) {
        try {
          const newProducts = JSON.parse(e.newValue);
          const publishedProducts = newProducts.filter((p: Product) => p.isPublished);
          setProducts(publishedProducts);
        } catch (error) {
          console.error('Errore sincronizzazione prodotti:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-br from-pastel-aqua-50 to-pastel-sky-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pastel-aqua-600 mx-auto mb-4"></div>
            <p className="text-pastel-aqua-700">Caricamento collezione...</p>
          </div>
        </div>
      </div>
    );
  }

  const featuredProducts = products.slice(0, 6);

  return (
    <section className="py-16 bg-gradient-to-br from-pastel-aqua-50 to-pastel-sky-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-pastel-aqua-900 mb-4">La Nostra Collezione</h2>
          <p className="text-xl text-pastel-aqua-700 max-w-2xl mx-auto">
            Scopri la bellezza artigianale dei nostri gioielli, creati con passione e materiali di qualità
          </p>
        </div>

        {featuredProducts.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif text-pastel-aqua-900 mb-2">{product.name}</h3>
                    <p className="text-pastel-aqua-700 mb-3 capitalize">{product.category}</p>
                    <p className="text-lg font-semibold text-pastel-aqua-600 mb-3">{product.price}</p>
                    <div className="text-sm text-pastel-aqua-600 space-y-1">
                      <p><strong>Materiali:</strong> {product.materials}</p>
                      <p><strong>Tecnica:</strong> {product.technique}</p>
                    </div>
                    {product.description && (
                      <p className="text-pastel-aqua-700 mt-3 text-sm">{product.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <a 
                href="/all-products.html" 
                className="inline-flex items-center bg-pastel-aqua-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-pastel-aqua-700 transition-colors text-lg"
              >
                Vedi tutta la collezione
                <ArrowRight className="ml-2" size={20} />
              </a>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-xl font-serif text-pastel-aqua-900 mb-2">Collezione in preparazione</h3>
              <p className="text-pastel-aqua-700 mb-4">
                I nostri artigiani stanno creando nuovi gioielli meravigliosi. Torna presto per scoprirli!
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Collection;