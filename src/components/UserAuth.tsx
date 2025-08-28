import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';

const UserAuth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    password: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await setDoc(doc(collection(db, 'users'), userCred.user.uid), {
        nome: form.nome,
        cognome: form.cognome,
        email: form.email,
        telefono: form.telefono,
        createdAt: new Date().toISOString()
      });
      setSuccessMsg('Registrazione completata! Ora puoi accedere.');
      setIsRegister(false);
      setForm({ nome: '', cognome: '', email: '', telefono: '', password: '' });
    } catch (error: any) {
      setErrorMsg(error.message || 'Errore registrazione');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      setSuccessMsg('Login effettuato!');
    } catch (error: any) {
      setErrorMsg(error.message || 'Errore login');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 mt-12">
      <h2 className="text-2xl font-serif text-pastel-aqua-900 mb-6 text-center">
        {isRegister ? 'Registrazione Cliente' : 'Login Cliente'}
      </h2>
      <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
        {isRegister && (
          <>
            <input type="text" name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg" required />
            <input type="text" name="cognome" value={form.cognome} onChange={handleChange} placeholder="Cognome" className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg" required />
            <input type="text" name="telefono" value={form.telefono} onChange={handleChange} placeholder="Telefono" className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg" required />
          </>
        )}
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg" required />
        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full px-4 py-3 border border-pastel-aqua-200 rounded-lg" required />
        {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}
        {successMsg && <div className="text-green-600 text-sm">{successMsg}</div>}
        <button type="submit" className="w-full bg-pastel-aqua-600 text-white py-3 rounded-lg font-semibold hover:bg-pastel-aqua-700 transition-colors">
          {isRegister ? 'Registrati' : 'Accedi'}
        </button>
      </form>
      <div className="text-center mt-4">
        <button onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); setSuccessMsg(''); }} className="text-pastel-aqua-700 hover:underline">
          {isRegister ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati'}
        </button>
      </div>
    </div>
  );
};

export default UserAuth;
