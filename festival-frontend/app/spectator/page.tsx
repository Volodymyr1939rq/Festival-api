"use client"

import React, { useState, useEffect } from 'react';
import { useSpectators } from '../hooks/useSpectators'; 
import { useApi } from '../hooks/useApi';
import { Ticket, Plus, Phone } from 'lucide-react';
import { Participant } from '../types'; 
import SpectatorCard from '../components/SpectatorCard';
import AddSpectatorModal from '../components/AddSpectatorForm';
import VotingModal from '../components/VotingModal';

export default function SpectatorsPage() {
  const { spectators, loader, addSpectator, deleteSpectator } = useSpectators();
  const { data: participants, loading: participantsLoading } = useApi<Participant>(process.env.NEXT_PUBLIC_API_URL + '/api/participants');

  const [showAddModal, setShowAddModal] = useState(false);
  const [votingSpectatorId, setVotingSpectatorId] = useState<string | null>(null);
  const [votedSpectators, setVotedSpectators] = useState<string[]>([]);

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
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spectators.map(spectator => (
              <SpectatorCard 
                key={spectator.id}
                spectator={spectator}
                hasVoted={votedSpectators.includes(spectator.id)}
                onDelete={deleteSpectator}
                onVoteClick={setVotingSpectatorId}
              />
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddSpectatorModal 
          spectators={spectators}
          onClose={() => setShowAddModal(false)}
          onAdd={addSpectator}
        />
      )}

      {votingSpectatorId && (
        <VotingModal 
          participants={participants}
          loading={participantsLoading}
          onClose={() => setVotingSpectatorId(null)}
          onVote={handleVote}
        />
      )}
    </main>
  );
}