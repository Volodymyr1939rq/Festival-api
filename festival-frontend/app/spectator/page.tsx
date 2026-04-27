"use client"

import { useState, useEffect } from 'react';
import { useSpectators } from '../hooks/useSpectators'; 
import { useApi } from '../hooks/useApi';
import { Ticket, Plus, Phone } from 'lucide-react';
import { Participant } from '../types'; 
import SpectatorCard from '../components/SpectatorCard';
import AddSpectatorModal from '../components/AddSpectatorForm';
import VotingModal from '../components/VotingModal';
import { AdminView } from '../components/AdminView';
import { useAuth } from '../hooks/useAuth';

export default function SpectatorsPage() {
  const { spectators, loader, addSpectator, deleteSpectator } = useSpectators();
  const { data: participants, loading: participantsLoading } = useApi<Participant>(process.env.NEXT_PUBLIC_API_URL + '/api/participants');

  const [showAddModal, setShowAddModal] = useState(false);
  const [votingSpectatorId, setVotingSpectatorId] = useState<string | null>(null);
  const [votedSpectators, setVotedSpectators] = useState<string[]>([]);
  const { isAdmin } = useAuth()
  
  useEffect(() => {
    const savedVotes = localStorage.getItem('votedTickets');
    if (savedVotes) {
      try {
        setVotedSpectators(JSON.parse(savedVotes));
      } catch (e) {
        console.error("Помилка читання голосів", e);
      }
    }
  }, []);

  const handleVote = async (participantId: string) => {
    if (!votingSpectatorId) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/participants/${participantId}/public-vote`, { method: 'POST'});
      if (!response.ok) throw new Error("Помилка сервера");
  
      const newVotedList = [...votedSpectators, votingSpectatorId];
      setVotedSpectators(newVotedList);
      localStorage.setItem('votedTickets', JSON.stringify(newVotedList));
      setVotingSpectatorId(null);
    } catch (error) {
      console.error("Помилка голосування", error);
    }
  };

  if (loader) return <div className="p-10 text-xl font-bold text-slate-500 flex justify-center min-h-screen bg-[#06041a]">Завантаження бази квитків...</div>;

  return (
    <main className="min-h-screen bg-[#06041a] text-white font-sans relative pt-24 pb-20 overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-rose-600/25 blur-[130px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute top-[5%] right-[-10%] w-[45vw] h-[45vw] bg-blue-600/25 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[5%] right-[5%] w-[50vw] h-[50vw] bg-fuchsia-600/20 blur-[140px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-15%] left-[-5%] w-[45vw] h-[45vw] bg-pink-600/20 blur-[130px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto p-6 md:p-10 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-white/10 pb-8">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-white/5 border border-white/10 text-pink-400 rounded-2xl shadow-[0_0_20px_rgba(236,72,153,0.2)] backdrop-blur-md">
              <Phone size={32} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-fuchsia-400 to-rose-400 tracking-tight mb-2 uppercase italic">
                Центр телеголосування
              </h1>
              <p className="text-white/60 font-medium text-lg">
                База глядачів: <span className="text-fuchsia-400 font-black">{spectators.length}</span> зареєстровано
              </p>
            </div>
          </div>
          <AdminView>
            <button 
              onClick={() => setShowAddModal(true)} 
              className="flex items-center justify-center bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-90 text-white px-8 py-3.5 rounded-full font-black uppercase text-sm tracking-widest shadow-[0_0_25px_rgba(236,72,153,0.3)] transition-all hover:scale-105 active:scale-95 gap-2"
            >
              <Plus size={20} strokeWidth={3} />
              Продати квиток
            </button>
          </AdminView>
        </div>

        {spectators.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-4xl border border-white/10 border-dashed backdrop-blur-md shadow-2xl">
            <Ticket size={64} className="mx-auto text-white/20 mb-6" />
            <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Ще не продано жодного квитка</h3>
            <p className="text-white/40 font-medium">Додайте першого глядача, щоб відкрити можливість голосування.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
            {spectators.map(spectator => (
              <SpectatorCard 
                key={spectator.id}
                spectator={spectator}
                hasVoted={votedSpectators.includes(spectator.id)}
                onDelete={deleteSpectator}
                onVoteClick={setVotingSpectatorId}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-md my-auto animate-in fade-in zoom-in duration-300">
            <AddSpectatorModal 
              spectators={spectators}
              onClose={() => setShowAddModal(false)}
              onAdd={addSpectator}
            />
          </div>
        </div>
      )}

      {votingSpectatorId && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl my-auto animate-in fade-in zoom-in duration-300">
            <VotingModal 
              participants={participants}
              loading={participantsLoading}
              onClose={() => setVotingSpectatorId(null)}
              onVote={handleVote}
            />
          </div>
        </div>
      )}
    </main>
  );
}