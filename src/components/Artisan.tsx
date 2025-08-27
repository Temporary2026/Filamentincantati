import { Award, Clock, Heart, Sparkles } from 'lucide-react';

const Artisan = () => {
  const achievements = [
    {
      icon: <Clock className="text-pastel-aqua-600" size={24} />,
      title: "15+ Anni",
      description: "Di esperienza nell'arte della bigiotteria"
    },
    {
      icon: <Award className="text-pastel-aqua-600" size={24} />,
      title: "500+ Pezzi",
      description: "Creati e venduti in tutta Italia"
    },
    {
      icon: <Heart className="text-red-500" size={24} />,
      title: "100% Passione",
      description: "Dedizione totale in ogni singolo pezzo"
    },
    {
      icon: <Sparkles className="text-yellow-500" size={24} />,
      title: "Pezzi Unici",
      description: "Mai due gioielli identici"
    }
  ];

  return (
    <section id="artigiana" className="py-20 bg-gradient-to-b from-pastel-sky-50 via-white to-pastel-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="order-2 lg:order-1">
            <div className="mb-8">
              <span className="text-pastel-aqua-600 font-medium tracking-wide uppercase text-sm">L'Artigiana</span>
              <h2 className="text-4xl lg:text-5xl font-serif text-pastel-aqua-900 mt-2 mb-6">
                Una vita intrecciata alla bellezza
              </h2>
            </div>

            <div className="prose prose-lg text-pastel-aqua-800 leading-relaxed mb-8">
              <p className="text-xl mb-6">
                <em>"Fin da bambina amavo creare con le mani. Dopo anni di studio e sperimentazione, 
                ho trasformato questa passione in <strong>Filamentincantati</strong>, dove ogni pezzo 
                nasce da ore di dedizione e amore per il dettaglio."</em>
              </p>
              
              <p className="mb-6">
                Daniela Liguori ha iniziato il suo percorso nell'arte della bigiotteria oltre 15 anni fa, 
                spinta dalla voglia di creare qualcosa di unico e personale. La sua formazione artistica 
                e la passione per le tecniche tradizionali l'hanno portata a sviluppare uno stile 
                inconfondibile che mescola eleganza classica e creatività contemporanea.
              </p>

              <div className="bg-gradient-to-r from-pastel-sky-100 to-pastel-rose-100 p-6 rounded-xl border-l-4 border-pastel-aqua-500">
                <p className="italic text-pastel-aqua-900 font-medium">
                  "Mi piace pensare che chi indossa i miei gioielli porti con sé un frammento della mia storia, 
                  un pezzo della mia anima intrecciato nei filamenti."
                </p>
                <p className="text-right text-pastel-aqua-700 mt-2">— Daniela Liguori</p>
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-3">
                    {achievement.icon}
                    <h3 className="ml-3 font-bold text-pastel-aqua-900">{achievement.title}</h3>
                  </div>
                  <p className="text-pastel-aqua-700 text-sm">{achievement.description}</p>
                </div>
              ))}
            </div>

            {/* Process Description */}
            <div className="bg-pastel-aqua-800 text-white p-8 rounded-2xl">
              <h3 className="text-2xl font-serif mb-4">Il Processo Creativo</h3>
              <p className="leading-relaxed">
                Ogni gioiello nasce da un'ispirazione: un colore, una texture, un ricordo. 
                Selezioni i materiali con cura, li studio, li combino. Poi inizia la magia: 
                ore di lavoro paziente, nodo dopo nodo, fino a quando non prende forma 
                un pezzo unico che racconta la sua storia.
              </p>
            </div>
          </div>

          {/* Right Column - Images */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Main Image */}
              <div className="relative z-10">
                <img
                  src="/img/IMG_8593.jpg"
                  alt="Daniela Liguori at work"
                  className="w-full rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
                  <p className="text-pastel-aqua-800 font-bold text-lg">Daniela Liguori</p>
                  <p className="text-pastel-aqua-600">Fondatrice Filamentincantati</p>
                  <p className="text-pastel-aqua-600 text-sm">Salerno, Italia</p>
                </div>
              </div>

              {/* Background Decoration */}
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full opacity-20 z-0"></div>
              <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-gradient-to-br from-amber-400 to-red-400 rounded-full opacity-20 z-0"></div>

              {/* Floating Elements */}
              <div className="absolute top-10 -right-4 bg-white p-4 rounded-lg shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-300">
                <img
                  src="/img/IMG_8594.jpg"
                  alt="Jewelry detail"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <p className="text-xs text-pastel-aqua-800 mt-2 text-center">Fatto a mano</p>
              </div>

              <div className="absolute bottom-20 -left-8 bg-white p-4 rounded-lg shadow-lg transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                <img
                  src="/img/IMG_8643.jpg"
                  alt="Materials"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <p className="text-xs text-pastel-aqua-800 mt-2 text-center">Materiali pregiati</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Artisan;