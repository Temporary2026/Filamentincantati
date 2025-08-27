import { Phone, Mail, MapPin, Instagram, Facebook, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contatti" className="bg-gradient-to-b from-pastel-aqua-800 to-pastel-aqua-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-6">
              <Heart className="text-pastel-rose-300 mr-2" size={24} />
              <h3 className="text-2xl font-serif">Filamentincantati</h3>
            </div>
            <p className="text-pastel-sky-100 leading-relaxed mb-6">
              Bigiotteria artigianale made in Salerno. Ogni pezzo è un'opera d'arte unica, 
              creata con passione e dedizione per chi ama distinguersi con eleganza.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/filamentincantati/"
                className="p-3 bg-pastel-rose-500 rounded-full hover:bg-pastel-rose-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.facebook.com/filamentincantati/"
                className="p-3 bg-pastel-sky-500 rounded-full hover:bg-pastel-sky-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-serif mb-6">Contatti</h3>
            <div className="space-y-4">
              <a
                href="tel:+393295381974"
                className="flex items-center text-pastel-sky-100 hover:text-white transition-colors"
              >
                <Phone size={18} className="mr-3" />
                +39 329 538 1974
              </a>
              <a
                href="mailto:filamentincantati@gmail.com"
                className="flex items-center text-pastel-sky-100 hover:text-white transition-colors"
              >
                <Mail size={18} className="mr-3" />
                filamentincantati@gmail.com
              </a>
              <div className="flex items-center text-pastel-sky-100">
                <MapPin size={18} className="mr-3" />
                Salerno, Italia
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-pastel-aqua-700/50 backdrop-blur-sm rounded-xl">
              <p className="font-semibold mb-2">Orari di Contatto</p>
              <p className="text-pastel-sky-100 text-sm">
                Lun-Ven: 9:00 - 18:00<br />
                Sab: 9:00 - 13:00<br />
                Dom: Solo urgenze
              </p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-serif mb-6">Servizi</h3>
            <ul className="space-y-3 text-pastel-sky-100">
              <li>• Creazione pezzi unici</li>
              <li>• Personalizzazioni su misura</li>
              <li>• Riparazioni gioielli</li>
              <li>• Consulenza stile</li>
              <li>• Spedizioni in tutta Italia</li>
              <li>• Confezioni regalo</li>
            </ul>
            
            <div className="mt-8 p-4 bg-gradient-rose-lavender rounded-xl">
              <p className="font-semibold mb-2 text-pastel-aqua-800">Garanzia Qualità</p>
              <p className="text-pastel-aqua-700 text-sm">
                Tutti i nostri gioielli sono garantiti contro difetti di fabbricazione. 
                Reso gratuito entro 14 giorni.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-pastel-aqua-600 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-pastel-sky-100">
                <strong>Filamentincantati</strong> - Bigiotteria artigianale made in Salerno, consegna in tutta Italia
              </p>
              <p className="text-pastel-sky-200 text-sm mt-1">
                Daniela Liguori Artigiana
              </p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-pastel-sky-100 text-sm">
                © 2024 Filamentincantati. Tutti i diritti riservati.
              </p>
              <p className="text-pastel-sky-200 text-xs mt-1">
                Made with ❤️ in Salerno
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;