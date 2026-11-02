import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Login({ isOpen, onClose, onLogin }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: err } = await supabase
        .from('access_codes')
        .select('role, name')
        .eq('code', code.trim().toUpperCase())
        .single();

      if (err || !data) {
        throw new Error('Неверный код');
      }

      onLogin({ role: data.role, name: data.name, code: code.trim().toUpperCase() });
      setCode('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#14100a] border border-[#fbbf24]/30 max-w-sm w-full rounded-3xl p-8 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500 hover:text-white text-white/50 transition-all">
          <i data-lucide="x" className="w-5 h-5"></i>
        </button>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#fbbf24] to-[#dc2626] flex items-center justify-center shadow-lg shadow-[#fbbf24]/40 mb-4 animate-bounce">
            <i data-lucide="shield-check" className="w-8 h-8 text-black"></i>
          </div>
          <h2 className="text-2xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#dc2626]">Вход для своих</h2>
          <p className="text-white/50 text-xs mt-2">Введите код доступа (Админ: AD12)</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="СЕКРЕТНЫЙ КОД"
              className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-center text-lg tracking-[0.3em] uppercase font-black text-white placeholder-white/20 focus:outline-none focus:border-[#fbbf24] focus:shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all"
              required
            />
          </div>
          
          {error && <div className="text-red-400 text-xs text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-sm"
          >
            {loading ? 'Проверяем...' : 'ВОЙТИ'}
          </button>
        </form>
      </div>
    </div>
  );
}