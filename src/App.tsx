import React from 'react';
import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import WhyHandmade from './components/WhyHandmade';
import Collection from './components/Collection';
import Artisan from './components/Artisan';
import Purchase from './components/Purchase';
import Footer from './components/Footer';
import AllProducts from './components/AllProducts';
import AdminPanel from './components/AdminPanel';
import UserAuth from './components/UserAuth';
import CookieBanner from './components/CookieBanner';

function App() {
  const RouterImpl = import.meta.env.PROD ? HashRouter : BrowserRouter;
  return (
    <RouterImpl>
      <Routes>
        <Route path="/" element={
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
        } />
        {/* Note: pages are now standalone .html entries for Vercel */}
      </Routes>
    </RouterImpl>
  );
}

export default App;