import { useState } from 'react';
import { Eye, Heart, Sparkles } from 'lucide-react';

const Collection = () => {
  const [selectedCategory, setSelectedCategory] = useState('tutti');
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const categories = [
    { id: 'tutti', name: 'Tutti i Pezzi' },
    { id: 'orecchini', name: 'Orecchini' },
    { id: 'collane', name: 'Collane' },
    { id: 'bracciali', name: 'Bracciali' }
  ];

  const collection = [
    {
      id: 1,
      name: "Luna d'Amalfi",
      category: 'collane',
      image: "/img/WhatsApp Image 2025-06-15 at 13.27.39 (1).jpeg",
      materials: "Perle di vetro veneziane, cotone cerato",
      technique: "Micro-macramè",
      price: "€45"
    },
    {
      id: 2,
      name: "Sirena",
      category: 'orecchini',
      image: "/img/WhatsApp Image 2025-06-15 at 13.27.39 (2).jpeg",
      materials: "Ottone nickel-free, perle naturali",
      technique: "Lavorazione a spiga",
      price: "€28"
    },
    {
      id: 3,
      name: "Tramonto Dorato",
      category: 'bracciali',
      image: "/img/WhatsApp Image 2025-06-15 at 13.27.39 (3).jpeg",
      materials: "Filati dorati, cristalli sfaccettati",
      technique: "Avvolgimento a mano",
      price: "€35"
    },
    {
      id: 4,
      name: "Petali di Rosa",
      category: 'orecchini',
      image: "/img/WhatsApp Image 2025-06-15 at 13.27.39 (4).jpeg",
      materials: "Perle rosa, argento 925",
      technique: "Intreccio tradizionale",
      price: "€32"
    },
    {
      id: 5,
      name: "Mare Nostrum",
      category: 'collane',
      image: "/img/WhatsApp Image 2025-06-15 at 13.27.40 (1).jpeg",
      materials: "Turchesi naturali, cotone blu",
      technique: "Nodo marinaro",
      price: "€42"
    },
    {
      id: 6,
      name: "Terra Madre",
      category: 'bracciali',
      image: "/img/8fe4abe2-1560-4c0c-9be1-135476a6feb6.jpg",
      materials: "Pietre dure, cuoio naturale",
      technique: "Intreccio etnico",
      price: "€38"
    }
  ];

  const filteredCollection = selectedCategory === 'tutti' 
    ? collection 
    : collection.filter(item => item.category === selectedCategory);

  return (
    <section id="collezione" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif text-pastel-aqua-900 mb-6">
            La Collezione
          </h2>
          <p className="text-xl text-pastel-aqua-700 leading-relaxed max-w-3xl mx-auto mb-8">
            Dove la tradizione incontra la creatività. Ogni pezzo nasce dalla selezione di materiali pregiati 
            e dall'applicazione di tecniche artigianali tramandate nel tempo.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
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
        </div>

        {/* Materials & Techniques Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-pastel-aqua-50 to-pastel-sky-100 p-8 rounded-2xl">
            <h3 className="text-2xl font-serif text-pastel-aqua-900 mb-4 flex items-center">
              <Sparkles className="mr-3 text-pastel-aqua-600" size={28} />
              Materiali Selezionati
            </h3>
            <ul className="space-y-3 text-pastel-aqua-800">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-pastel-aqua-600 rounded-full mr-3"></div>
                Filati di cotone cerato premium
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-pastel-aqua-600 rounded-full mr-3"></div>
                Perle di vetro veneziane autentiche
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-pastel-aqua-600 rounded-full mr-3"></div>
                Ottone nickel-free per pelli sensibili
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-pastel-aqua-600 rounded-full mr-3"></div>
                Pietre naturali certificate
              </li>
            </ul>
            <p className="text-pastel-aqua-700 mt-4 italic">
              "Niente plastica o materiali low-cost: solo elementi durevoli e sicuri."
            </p>
          </div>

          <div className="bg-gradient-to-br from-pastel-aqua-50 to-pastel-sky-100 p-8 rounded-2xl">
            <h3 className="text-2xl font-serif text-pastel-aqua-900 mb-4 flex items-center">
              <Heart className="mr-3 text-pastel-red-500" size={28} />
              Tecniche Artigianali
            </h3>
            <ul className="space-y-3 text-pastel-aqua-800">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-pastel-red-500 rounded-full mr-3"></div>
                Micro-macramè tradizionale
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-pastel-red-500 rounded-full mr-3"></div>
                Lavorazione a spiga manuale
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-pastel-red-500 rounded-full mr-3"></div>
                Avvolgimento artistico a mano
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-pastel-red-500 rounded-full mr-3"></div>
                Intreccio etnico contemporaneo
              </li>
            </ul>
          </div>
        </div>

        {/* Collection Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCollection.map((item) => (
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
                        <Heart size={20} className="text-pastel-red-500" />
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
                
                <div className="space-y-2 text-sm text-pastel-aqua-700">
                  <p><strong>Materiali:</strong> {item.materials}</p>
                  <p><strong>Tecnica:</strong> {item.technique}</p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="bg-pastel-sky-100 text-pastel-aqua-800 px-3 py-1 rounded-full text-xs font-medium">
                    Pezzo Unico
                  </span>
                  <button className="text-pastel-aqua-600 hover:text-pastel-aqua-800 font-medium text-sm transition-colors">
                    Scopri di più →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-pastel-aqua-700 italic text-lg">
            Ogni collezione è limitata e numerata. Non troverai mai due pezzi identici.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Collection;