import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import WhyHandmade from './components/WhyHandmade';
import Collection from './components/Collection';
import Artisan from './components/Artisan';
import Purchase from './components/Purchase';
import Footer from './components/Footer';
import UserAuth from './components/UserAuth';
import CookieBanner from './components/CookieBanner';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <CookieBanner />
      <Hero />
      <WhyHandmade />
      <Collection />
      <UserAuth />
      <Artisan />
      <Purchase />
      <Footer />
    </div>
  );
}

export default App;