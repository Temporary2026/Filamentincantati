import { ShoppingBag, MessageCircle, Mail, Instagram, Facebook, Star, Shield, Truck } from 'lucide-react';

const Purchase = () => {
  const features = [
    {
      icon: <Shield className="text-green-600" size={24} />,
      title: "Garanzia Qualità",
      description: "Ogni pezzo è garantito e certificato"
    },
    {
      icon: <Truck className="text-blue-600" size={24} />,
      title: "Spedizione Sicura",
      description: "Consegna in tutta Italia con tracking"
    },
    {
      icon: <Star className="text-yellow-500" size={24} />,
      title: "Soddisfazione 100%",
      description: "Reso gratuito entro 14 giorni"
    }
  ];

  return (
    <section id="acquista" className="py-20 bg-gradient-to-b from-white to-pastel-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif text-pastel-aqua-900 mb-6">
            Ispira il tuo stile con un gioiello
          </h2>
          <p className="text-2xl font-serif text-pastel-aqua-700 mb-4">
            Firmato Filamentincantati
          </p>
          <p className="text-xl text-pastel-aqua-700 leading-relaxed max-w-3xl mx-auto">
            Ogni collezione è <strong>limitata e numerata</strong>. Non troverai mai due pezzi identici. 
            Aggiungi un tocco di unicità al tuo guardaroba.
          </p>
        </div>

        {/* Main CTA Section */}
        <div className="bg-gradient-to-r from-pastel-aqua-800 to-pastel-rose-400 rounded-3xl p-12 text-white text-center mb-16">
          <h3 className="text-3xl font-serif mb-6">Acquista il Tuo Pezzo Unico</h3>
          <p className="text-lg mb-8 opacity-90">
            Scegli il canale che preferisci per acquistare o richiedere informazioni
          </p>
          
          <div className="flex justify-center items-center">
            <a
              href="https://wa.me/393295381974?text=Ciao! Sono interessato/a ai gioielli Filamentincantati"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-8 py-4 bg-white text-pastel-aqua-800 font-bold rounded-full hover:bg-pastel-sky-100 transition-all duration-300 hover:scale-105 shadow-lg min-w-[250px]"
            >
              <MessageCircle className="mr-3" size={24} />
              WhatsApp Diretto
            </a>
          </div>
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Direct Contact */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-serif text-pastel-aqua-900 mb-6">Contatto Diretto</h3>
            <div className="space-y-4">
              <a
                href="https://wa.me/393295381974"
                className="flex items-center p-4 bg-pastel-mint-50 rounded-xl hover:bg-pastel-mint-100 transition-colors group"
              >
                <MessageCircle className="text-pastel-mint-600 mr-4 group-hover:scale-110 transition-transform" size={24} />
                <div>
                  <p className="font-semibold text-pastel-mint-800">WhatsApp</p>
                  <p className="text-pastel-mint-600">+39 329 538 1974</p>
                </div>
              </a>
              
              <a
                href="mailto:filamentincantati@gmail.com"
                className="flex items-center p-4 bg-pastel-sky-50 rounded-xl hover:bg-pastel-sky-100 transition-colors group"
              >
                <Mail className="text-pastel-sky-600 mr-4 group-hover:scale-110 transition-transform" size={24} />
                <div>
                  <p className="font-semibold text-pastel-sky-800">Email</p>
                  <p className="text-pastel-sky-600">filamentincantati@gmail.com</p>
                </div>
              </a>
            </div>
            
            <div className="mt-6 p-4 bg-pastel-sky-100 rounded-xl">
              <p className="text-pastel-aqua-800 font-medium mb-2">Personalizzazioni</p>
              <p className="text-pastel-aqua-700 text-sm">
                Contattami per richiedere pezzi personalizzati o modifiche su misura. 
                Ogni richiesta è benvenuta!
              </p>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-serif text-pastel-aqua-900 mb-6">Seguimi sui Social</h3>
            <div className="space-y-4">
              <a
                href="https://www.instagram.com/filamentincantati/"
                className="flex items-center p-4 bg-pastel-rose-50 rounded-xl hover:bg-pastel-rose-100 transition-colors group"
              >
                <Instagram className="text-pastel-rose-600 mr-4 group-hover:scale-110 transition-transform" size={24} />
                <div>
                  <p className="font-semibold text-pastel-rose-800">Instagram</p>
                  <p className="text-pastel-rose-600">@filamentincantati</p>
                </div>
              </a>
              
              <a
                href="https://www.facebook.com/filamentincantati/"
                className="flex items-center p-4 bg-pastel-sky-50 rounded-xl hover:bg-pastel-sky-100 transition-colors group"
              >
                <Facebook className="text-pastel-sky-600 mr-4 group-hover:scale-110 transition-transform" size={24} />
                <div>
                  <p className="font-semibold text-pastel-sky-800">Facebook</p>
                  <p className="text-pastel-sky-600">Filamentincantati</p>
                </div>
              </a>
            </div>
            
            <div className="mt-6 p-4 bg-pastel-sky-100 rounded-xl">
              <p className="text-pastel-aqua-800 font-medium mb-2">Novità e anteprime</p>
              <p className="text-pastel-aqua-700 text-sm">
                Seguimi per vedere i pezzi in anteprima, il processo creativo e 
                le storie dietro ogni gioiello.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex p-4 bg-white rounded-full shadow-lg mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-pastel-aqua-900 mb-2">{feature.title}</h3>
              <p className="text-pastel-aqua-700">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg inline-block">
            <p className="text-2xl font-serif text-pastel-aqua-900 mb-2">
              Pronto a indossare l'arte?
            </p>
            <p className="text-pastel-aqua-700 mb-6">
              Ogni gioiello Filamentincantati è un investimento nella bellezza autentica
            </p>
            <a
              href="#collezione"
              className="inline-flex items-center px-8 py-4 bg-pastel-aqua-600 text-white font-bold rounded-full hover:bg-pastel-aqua-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <ShoppingBag className="mr-2" size={20} />
              Vedi la Collezione
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Purchase;