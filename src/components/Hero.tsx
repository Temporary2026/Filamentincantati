import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/img/SfondoHero2.jpg"
          alt="Artisan jewelry crafting"
          className="w-full h-full object-cover scale-150 -translate-x-16"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pastel-aqua-900/80 via-pastel-sky-800/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <div className="flex items-center mb-6">
              <Sparkles className="text-pastel-rose-300 mr-3" size={32} />
              <span className="text-pastel-rose-300 font-medium tracking-wide uppercase text-sm">Bigiotteria Artigianale</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-serif leading-tight mb-6">
              L'Arte della
              <span className="block text-pastel-rose-300">Bigiotteria</span>
              <span className="block">Artigianale</span>
            </h1>
            
            <p className="text-xl leading-relaxed mb-8 text-pastel-sky-50">
              Ogni gioiello è una storia plasmata a mano. Scopri la magia di <strong>Filamentincantati</strong>, 
              bigiotteria artigianale fatta di passione e dettagli unici.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/all-products.html"
                className="inline-flex items-center justify-center px-8 py-4 bg-pastel-rose-400 text-white font-semibold rounded-full hover:bg-pastel-rose-500 transition-all duration-300 hover:shadow-pastel-lg hover:scale-105"
              >
                Sfoglia la Collezione
                <ArrowRight className="ml-2" size={20} />
              </a>
              
              <a
                href="#artigiana"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-pastel-sky-200 text-pastel-sky-200 font-semibold rounded-full hover:bg-pastel-sky-200 hover:text-pastel-aqua-900 transition-all duration-300"
              >
                Conosci l'Artigiana
              </a>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative">
              {/* Ellipse container with white background */}
              <div className="relative w-96 h-96 mx-auto">
                <div className="absolute inset-0 bg-white rounded-full transform rotate-12"></div>
                <div className="absolute inset-2 bg-white rounded-full transform -rotate-6"></div>
                <div className="absolute inset-4 overflow-hidden rounded-full transform rotate-3">
                  <img
                    src="/img/IMG_8592.jpg"
                    alt="Handcrafted jewelry detail"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-pastel">
                <p className="text-pastel-aqua-700 font-medium">Ogni pezzo è unico</p>
                <p className="text-pastel-aqua-500 text-sm">Numerato e certificato</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;