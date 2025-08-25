import { Heart, Leaf, Palette, Award } from 'lucide-react';

const WhyHandmade = () => {
  const benefits = [
    {
      icon: <Palette className="text-pastel-lavender-500" size={40} />,
      title: "Personalizzazione",
      description: "Pezzi unici, non seriali. Ogni gioiello racconta una storia diversa.",
      stat: "100% Unico"
    },
    {
      icon: <Leaf className="text-pastel-mint-500" size={40} />,
      title: "Sostenibilità", 
      description: "Materiali selezionati, niente produzione di massa. Rispetto per l'ambiente.",
      stat: "Zero Sprechi"
    },
    {
      icon: <Heart className="text-pastel-rose-500" size={40} />,
      title: "Passione Artigianale",
      description: "Ore di dedizione e amore per il dettaglio in ogni singolo pezzo.",
      stat: "Fatto a Mano"
    },
    {
      icon: <Award className="text-pastel-peach-500" size={40} />,
      title: "Qualità Accessibile",
      description: "Eleganza premium senza rinunciare a un prezzo equo e sostenibile.",
      stat: "Prezzo Giusto"
    }
  ];

  return (
    <section className="py-20 bg-gradient-pastel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif text-pastel-aqua-800 mb-6">
            Perché Scegliere la Bigiotteria Artigianale?
          </h2>
          <p className="text-xl text-pastel-aqua-600 leading-relaxed max-w-3xl mx-auto">
            Elegante, sostenibile, accessibile: il potere della bigiotteria artigianale
          </p>
          <div className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-pastel inline-block">
            <p className="text-pastel-aqua-700 font-semibold text-lg">
              Il 68% delle donne italiane preferisce bigiotteria artigianale per occasioni informali
            </p>
            <p className="text-pastel-aqua-500 text-sm mt-2">Fonte: Ricerche di settore 2024</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-pastel hover:shadow-pastel-lg transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                {benefit.icon}
              </div>
              <div className="bg-pastel-sky-100 text-pastel-sky-700 px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                {benefit.stat}
              </div>
              <h3 className="text-xl font-serif text-pastel-aqua-800 mb-4">{benefit.title}</h3>
              <p className="text-pastel-aqua-600 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-sky-aqua p-8 rounded-2xl text-white shadow-pastel-lg">
            <h3 className="text-2xl font-serif mb-4 drop-shadow-lg">La Differenza è nei Dettagli</h3>
            <p className="text-lg leading-relaxed max-w-2xl mx-auto drop-shadow-md">
              Mentre la produzione industriale punta sulla quantità, noi ci concentriamo sulla qualità. 
              Ogni pezzo Filamentincantati è il risultato di tecniche tradizionali e materiali pregiati.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyHandmade;