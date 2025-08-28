import React, { useState, useEffect } from 'react';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookie_consent');
    if (!accepted) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-pastel-aqua-900 text-white p-4 z-50 flex flex-col md:flex-row items-center justify-between shadow-lg">
      <div className="mb-2 md:mb-0 text-center md:text-left">
        Questo sito utilizza cookie tecnici e di terze parti per migliorare l'esperienza utente. Proseguendo accetti la nostra <a href="/privacy.html" className="underline text-pastel-rose-300 hover:text-pastel-rose-200">Privacy Policy</a>.
      </div>
      <button onClick={acceptCookies} className="bg-pastel-rose-500 hover:bg-pastel-rose-600 text-white px-6 py-2 rounded-lg font-semibold ml-0 md:ml-4 mt-2 md:mt-0">
        Accetta
      </button>
    </div>
  );
};

export default CookieBanner;
