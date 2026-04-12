"use client"

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSpectators } from '../hooks/useSpectators'; 
import { useApi } from '../hooks/useApi'; // Додаємо хук для завантаження учасників
import { Ticket, User, Trash2, Plus, X, QrCode, Phone, Heart, Star, CheckCircle2 } from 'lucide-react';

interface SpectatorForm {
  fullName: string;
  ticketNumber: string;
}

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  performanceGenre: string;
}

export default function SpectatorsPage() {
  const { spectators, loader, addSpectator, deleteSpectator } = useSpectators();
  

  const { data: participants, loading: participantsLoading } = useApi<Participant>(process.env.NEXT_PUBLIC_API_URL + '/api/participants');

  const [showAddModal, setShowAddModal] = useState(false);
  const [votingSpectatorId, setVotingSpectatorId] = useState<string | null>(null);
  const [votedSpectators, setVotedSpectators] = useState<string[]>([]);
  const { register, handleSubmit, reset } = useForm<SpectatorForm>();
  const [error,setError]=useState<string | null>(null)
  const [isVoting,setIsVoting]=useState<string | null>()

  useEffect(() => {
    const savedVotes = localStorage.getItem('votedTickets');
    if (savedVotes) {
      try {
        setVotedSpectators(JSON.parse(savedVotes));
      } catch (e) {
        console.error("Помилка читання голосів з пам'яті", e);
      }
    }
  }, []);

  const onSubmit = async (data: SpectatorForm) => {
    setError(null)

    const isSeatSpectator=spectators.some(s=>s.ticketNumber.toLowerCase().trim()===data.ticketNumber.toLowerCase().trim())
    if(isSeatSpectator){
      setError(`Місце ${data.ticketNumber} уже зайняте виберіть інше місце`)
      return 
    }
    const success = await addSpectator(data);
    if (success) {
      setShowAddModal(false);
      reset();
    }
  };

 const handleVote = async (participantId: string) => {
    if (!votingSpectatorId) return;
    setIsVoting(participantId); 

    try {
      const response = await fetch(`http://localhost:8080/api/participants/${participantId}/public-vote`, { 
        method: 'POST' 
      });

      if (!response.ok) throw new Error("Помилка сервера");
      
      // Створюємо новий список голосів
      const newVotedList = [...votedSpectators, votingSpectatorId];
      
      // Оновлюємо стейт
      setVotedSpectators(newVotedList);
      
      // Зберігаємо в пам'ять браузера (важливо!)
      localStorage.setItem('votedTickets', JSON.stringify(newVotedList));
      
      setVotingSpectatorId(null);
    } catch (error) {
      console.error("Помилка голосування", error);
    } finally {
      setIsVoting(null);
    }
  };

  if (loader) return <div className="p-10 text-xl font-bold text-slate-500 flex justify-center min-h-screen bg-neutral-950">Завантаження бази квитків...</div>;

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans relative pt-24 pb-20 overflow-hidden">
      
      <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto p-6 md:p-10 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-neutral-800/50 pb-8">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-linear-to-br from-pink-500 to-purple-600 text-white rounded-2xl shadow-[0_0_20px_rgba(236,72,153,0.4)]">
              <Phone size={32} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-purple-500 tracking-tight mb-2 uppercase">
                Центр телеголосування
              </h1>
              <p className="text-neutral-400 font-medium text-lg">
                База глядачів: <span className="text-pink-500 font-black">{spectators.length}</span> зареєстровано
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)} 
            className="flex items-center gap-2 px-8 py-3.5 bg-white text-black hover:bg-neutral-200 rounded-full font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
          >
            <Plus size={20} strokeWidth={3} />
            Продати квиток
          </button>
        </div>

        {spectators.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-4xl border border-white/10 border-dashed backdrop-blur-md">
            <Ticket size={64} className="mx-auto text-neutral-600 mb-6" />
            <h3 className="text-2xl font-black text-white uppercase tracking-wider">Ще не продано жодного квитка</h3>
            <p className="text-neutral-400 text-lg mt-2">Натисніть кнопку вище, щоб зареєструвати першого глядача.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spectators.map(spectator => {
              const hasVoted = votedSpectators.includes(spectator.id);

              return (
                <div key={spectator.id} className="relative bg-[#111322] rounded-4xl shadow-2xl border border-white/10 overflow-hidden hover:border-pink-500/50 transition-colors group flex flex-col">
            
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-neutral-950 rounded-full border-l border-white/10"></div>
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-neutral-950 rounded-full border-r border-white/10"></div>

                  <div className="p-6 border-b border-white/5 border-dashed relative z-10 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-3 py-1 bg-pink-500/10 text-pink-500 border border-pink-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                        VIP глядач
                      </div>
                      <div className="text-neutral-500 font-mono text-sm tracking-widest">
                        #{spectator.ticketNumber}
                      </div>
                    </div>
                    
                    <h3 className="font-black text-white text-2xl uppercase tracking-tight mb-1 truncate">
                      {spectator.fullName}
                    </h3>
                  </div>
               
                  <div className="p-4 bg-black/40 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <QrCode size={36} className="text-neutral-600" />
                      <button 
                        onClick={() => deleteSpectator(spectator.id)}
                        className="p-2 text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-colors"
                        title="Анулювати квиток"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <button 
                      onClick={() => !hasVoted && setVotingSpectatorId(spectator.id)}
                      disabled={hasVoted}
                      className={`px-5 py-2.5 rounded-full font-black text-sm uppercase tracking-wider transition-all flex items-center gap-2 ${
                        hasVoted 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default' 
                          : 'bg-linear-to-r from-pink-600 to-purple-600 text-white hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] active:scale-95'
                      }`}
                    >
                      {hasVoted ? (
                        <><CheckCircle2 size={16} /> Голос віддано</>
                      ) : (
                        <><Heart size={16} /> Голосувати</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-100 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] rounded-4xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-neutral-800 w-full max-w-sm flex flex-col relative overflow-hidden">
            
            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-blue-500 to-indigo-500"></div>
            
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3 text-white">
                <Ticket size={20} className="text-indigo-400" />
                <h2 className="text-lg font-black uppercase tracking-wide">Реєстрація квитка</h2>
              </div>
              <button onClick={() => { setShowAddModal(false); reset(); }} className="text-neutral-500 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
              <div className="p-6 flex flex-col gap-5">
                <div>
                  <label className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <User size={14} className="text-indigo-400" /> Ім'я та Прізвище
                  </label>
                  <input 
                    {...register('fullName', { required: true })} 
                    placeholder="Напр. Марія Петренко"
                    className="w-full p-4 bg-neutral-900 border border-neutral-700 rounded-2xl outline-none focus:bg-neutral-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-white placeholder:text-neutral-600" 
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <QrCode size={14} className="text-indigo-400" /> Номер квитка / Місце
                  </label>
                  <input 
                    {...register('ticketNumber', { required: true })} 
                    placeholder="Напр. VIP-012"
                    className="w-full p-4 bg-neutral-900 border border-neutral-700 rounded-2xl outline-none focus:bg-neutral-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono font-bold text-white uppercase placeholder:text-neutral-600" 
                  />
                </div>
                {error && (
                  <div className='p-3 bg-rose-500/10 border border-rose-500/50 rounded-xl text-rose-400 text-sm font-bold flex items-center gap-2 animate-in fade-in zoom-in-95'>
                    <X size={16}/>
                    {error}
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-black/40 border-t border-white/5 flex justify-end gap-3">
                <button type="button" onClick={() => { setShowAddModal(false); reset(); }} className="px-5 py-2.5 text-sm font-bold text-neutral-400 hover:text-white rounded-full transition-colors">
                  Скасувати
                </button>
                <button type="submit" className="px-6 py-2.5 text-sm font-black text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-full shadow-lg transition-all active:scale-95 uppercase tracking-wide">
                  Зареєструвати
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {votingSpectatorId && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-100 p-4 backdrop-blur-xl animate-in zoom-in-95 duration-300">
          <div className="bg-[#050505] rounded-4xl border border-pink-500/30 shadow-[0_0_100px_rgba(236,72,153,0.3)] w-full max-w-4xl h-[80vh] flex flex-col relative overflow-hidden">
            
            <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-linear-to-r from-pink-600/20 to-purple-900/20">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                  <Phone size={28} className="text-pink-500 animate-pulse" />
                  Віддати свій голос
                </h2>
                <p className="text-neutral-400 mt-1 font-medium">Оберіть свого фаворита. Ви можете проголосувати лише один раз!</p>
              </div>
              <button onClick={() => setVotingSpectatorId(null)} className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {participantsLoading ? (
                <div className="text-center text-neutral-500 font-bold mt-20">Підключення до сцени...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {participants?.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => handleVote(p.id)}
                      className="group relative rounded-3xl overflow-hidden aspect-square text-left transition-all hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] focus:outline-none focus:ring-4 focus:ring-pink-500"
                    >
                      <img 
                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${p.id}&backgroundColor=374151`} 
                        alt="Participant" 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent"></div>
                      
                      <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col">
                        <span className="text-xs font-black text-pink-500 uppercase tracking-widest mb-1">{p.performanceGenre}</span>
                        <span className="text-2xl font-black text-white uppercase leading-none">{p.firstName}</span>
                        <span className="text-lg font-bold text-neutral-300 uppercase">{p.lastName}</span>
                      </div>

                      <div className="absolute inset-0 bg-pink-600/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                        <Heart size={48} className="text-white mb-2 animate-bounce" fill="currentColor" />
                        <span className="text-white font-black text-xl uppercase tracking-widest">Проголосувати</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </main>
  );
}