import React, { useState, useEffect } from 'react';
import { categories } from './theme';
import { supabase } from './supabaseClient';

export default function DishForm({ isOpen, onClose, onSave, initialData, code }) {
  const [form, setForm] = useState({
    title: '', description: '', price: '', weight: '', category: 'pizza', photos: [], videos: []
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price || '',
        weight: initialData.weight || '',
        category: initialData.category || 'pizza',
        photos: initialData.photos || [],
        videos: initialData.videos || [],
      });
    } else {
      setForm({ title: '', description: '', price: '', weight: '', category: 'pizza', photos: [], videos: [] });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);
    const newPhotos = [...form.photos];
    const newVideos = [...form.videos];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error } = await supabase.storage.from('dishes').upload(fileName, file);
      
      if (!error) {
        const { data: urlData } = supabase.storage.from('dishes').getPublicUrl(fileName);
        if (file.type.includes('video')) {
          newVideos.push(urlData.publicUrl);
        } else {
          newPhotos.push(urlData.publicUrl);
        }
      }
    }
    
    setForm(prev => ({ ...prev, photos: newPhotos, videos: newVideos }));
    setUploading(false);
  };

  const removePhoto = (index) => setForm(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
  const removeVideo = (index) => setForm(prev => ({ ...prev, videos: prev.videos.filter((_, i) => i !== index) }));

  const submit = async (e) => {
    e.preventDefault();
    
    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      weight: form.weight,
      category: form.category,
      photos: form.photos,
      videos: form.videos,
      created_by: initialData ? initialData.created_by : (code === 'AD12' ? 'admin' : 'mobilograf'),
      created_by_code: code,
      updated_at: new Date().toISOString()
    };

    let error;
    if (initialData) {
      const { error: err } = await supabase.from('dishes').update(payload).eq('id', initialData.id);
      error = err;
    } else {
      const { error: err } = await supabase.from('dishes').insert([payload]);
      error = err;
    }

    if (error) {
      alert('Ошибка: ' + error.message);
    } else {
      onSave();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#14100a] border border-[#fbbf24]/30 w-full max-w-2xl rounded-3xl p-6 relative shadow-[0_0_50px_rgba(251,191,36,0.15)] my-8">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500 hover:text-white text-white/50 transition-all z-20">
          <i data-lucide="x" className="w-5 h-5"></i>
        </button>
        
        <h2 className="text-xl font-bold text-[#fbbf24] mb-6 font-display flex items-center gap-2">
          <i data-lucide={initialData ? "edit" : "plus-circle"} className="w-5 h-5"></i>
          {initialData ? 'Редактировать блюдо' : 'Добавить новое блюдо'}
        </h2>
        
        <form onSubmit={submit} className="space-y-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/50 mb-1 block font-bold uppercase tracking-wider">Название</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#fbbf24] transition" placeholder="Пицца Маргарита" />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block font-bold uppercase tracking-wider">Цена (₸)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} required className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#fbbf24] transition" placeholder="2500" />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block font-bold uppercase tracking-wider">Грамовка (вес)</label>
              <input type="text" name="weight" value={form.weight} onChange={handleChange} placeholder="550 г" className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#fbbf24] transition" />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block font-bold uppercase tracking-wider">Категория</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#fbbf24] transition appearance-none">
                {categories.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id} className="bg-[#14100a] text-white">{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-white/50 mb-1 block font-bold uppercase tracking-wider">Описание / Состав</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="3" className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#fbbf24] transition" placeholder="Тесто, томатный соус, моцарелла..."></textarea>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <label className="text-xs text-white/50 mb-3 block font-bold uppercase tracking-wider">Фото и Видео</label>
            <input type="file" multiple accept="image/*,video/*" onChange={handleFileUpload} className="text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#fbbf24]/20 file:text-[#fbbf24] hover:file:bg-[#fbbf24]/30 cursor-pointer file:cursor-pointer transition" />
            {uploading && <p className="text-xs text-[#fbbf24] mt-3 flex items-center gap-2"><div className="w-3 h-3 border-2 border-[#fbbf24] border-t-transparent rounded-full animate-spin"></div> Загрузка файлов...</p>}
            
            <div className="flex flex-wrap gap-3 mt-4">
              {form.photos.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt="" className="w-16 h-16 object-cover rounded-xl border border-white/20" />
                  <button type="button" onClick={() => removePhoto(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg">✕</button>
                </div>
              ))}
              {form.videos.map((url, i) => (
                <div key={i} className="relative group">
                  <video src={url} className="w-16 h-16 object-cover rounded-xl border border-white/20" />
                  <button type="button" onClick={() => removeVideo(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg">✕</button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-3.5 mt-4">
            <i data-lucide="save" className="w-5 h-5"></i>
            Сохранить
          </button>
        </form>
      </div>
    </div>
  );
}