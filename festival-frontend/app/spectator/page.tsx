"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSpectators } from '../hooks/useSpectators'; // Перевір шлях!
import { Ticket, User, Trash2, Plus, X, QrCode } from 'lucide-react';

interface SpectatorForm {
  fullName: string;
  ticketNumber: string;
}

export default function SpectatorsPage() {
  const { spectators, loader, addSpectator, deleteSpectator } = useSpectators();
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit, reset } = useForm<SpectatorForm>();

  const onSubmit = async (data: SpectatorForm) => {
    const success = await addSpectator(data);
    if (success) {
      setShowModal(false);
      reset();
    }
  };

  if (loader) return <div className="p-10 text-xl font-bold text-slate-500 flex justify-center min-h-screen">Завантаження бази квитків...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-250 mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <Ticket size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Глядачі та Квитки
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Продано квитків: <span className="text-indigo-600 font-bold">{spectators.length}</span>
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowModal(true)} 
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md focus:ring-4 focus:ring-indigo-500/20"
          >
            <Plus size={18} />
            Продати квиток
          </button>
        </div>

        {spectators.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
            <Ticket size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-600">Ще не продано жодного квитка</h3>
            <p className="text-slate-400 text-sm mt-1">Натисніть кнопку вище, щоб зареєструвати першого глядача.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spectators.map(spectator => (
              <div key={spectator.id} className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
        
                <div className="flex-1 p-4 border-r border-slate-200 border-dashed relative">
                  <div className="w-4 h-4 bg-slate-50 rounded-full absolute -right-2 -top-2 border border-slate-200"></div>
                  <div className="w-4 h-4 bg-slate-50 rounded-full absolute -right-2 -bottom-2 border border-slate-200"></div>
                  
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Глядач</div>
                  <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-3">
                    <User size={16} className="text-slate-400"/> {spectator.fullName}
                  </h3>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Номер квитка</div>
                  <div className="inline-block px-3 py-1 bg-slate-100 text-slate-700 font-mono font-bold rounded-md text-sm">
                    {spectator.ticketNumber}
                  </div>
                </div>
                
                <div className="w-24 bg-indigo-50 flex flex-col items-center justify-center p-3 relative">
                  <QrCode size={32} className="text-indigo-300 mb-2" />
                  <button 
                    onClick={() => deleteSpectator(spectator.id)}
                    className="p-2 text-rose-400 hover:text-white hover:bg-rose-500 rounded-lg transition-colors absolute bottom-2 right-2 opacity-0 group-hover:opacity-100"
                    title="Анулювати квиток"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
            
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-800">
                <Ticket size={20} className="text-indigo-600" />
                <h2 className="text-lg font-bold">Реєстрація квитка</h2>
              </div>
              <button onClick={() => { setShowModal(false); reset(); }} className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-200 rounded-md">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
              <div className="p-6 flex flex-col gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    Ім'я та Прізвище
                  </label>
                  <input 
                    {...register('fullName', { required: true })} 
                    placeholder="Напр. Марія Петренко"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-800" 
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    Номер квитка / Місце
                  </label>
                  <input 
                    {...register('ticketNumber', { required: true })} 
                    placeholder="Напр. VIP-012 або Ряд 5, Місце 1"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono font-bold text-slate-800 uppercase" 
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => { setShowModal(false); reset(); }} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-colors">
                  Скасувати
                </button>
                <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-md">
                  Зберегти
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}