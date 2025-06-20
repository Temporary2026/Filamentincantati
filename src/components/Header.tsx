import React from 'react';
import { Menu, X, Phone } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm fixed w-full top-0 z-50 shadow-pastel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-serif text-pastel-aqua-600">Filamentincantati</h1>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#collezione" className="text-pastel-aqua-700 hover:text-pastel-aqua-500 transition-colors font-medium">Collezione</a>
            <a href="#artigiana" className="text-pastel-aqua-700 hover:text-pastel-aqua-500 transition-colors font-medium">L'Artigiana</a>
            <a href="#acquista" className="text-pastel-aqua-700 hover:text-pastel-aqua-500 transition-colors font-medium">Acquista</a>
            <a href="#contatti" className="text-pastel-aqua-700 hover:text-pastel-aqua-500 transition-colors font-medium">Contatti</a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <a href="tel:+393295381974" className="flex items-center text-pastel-aqua-600 hover:text-pastel-aqua-500 transition-colors bg-pastel-sky-50 px-4 py-2 rounded-full hover:bg-pastel-sky-100">
              <Phone size={18} className="mr-2" />
              <span className="text-sm font-medium">+39 329 538 1974</span>
            </a>
          </div>

          <button
            className="md:hidden p-2 text-pastel-aqua-600 hover:text-pastel-aqua-500 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-pastel-aqua-100">
            <nav className="flex flex-col space-y-4">
              <a href="#collezione" className="text-pastel-aqua-700 hover:text-pastel-aqua-500 transition-colors">Collezione</a>
              <a href="#artigiana" className="text-pastel-aqua-700 hover:text-pastel-aqua-500 transition-colors">L'Artigiana</a>
              <a href="#acquista" className="text-pastel-aqua-700 hover:text-pastel-aqua-500 transition-colors">Acquista</a>
              <a href="#contatti" className="text-pastel-aqua-700 hover:text-pastel-aqua-500 transition-colors">Contatti</a>
              <a href="tel:+393295381974" className="flex items-center text-pastel-aqua-600 bg-pastel-sky-50 px-4 py-2 rounded-full">
                <Phone size={16} className="mr-2" />
                +39 329 538 1974
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;