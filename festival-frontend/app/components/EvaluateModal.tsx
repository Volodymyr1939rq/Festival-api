"use client"
import React, { useEffect, useState } from "react";
import { X, Trophy } from "lucide-react";
import { useApi } from "../hooks/useApi"; 

interface EvaluateModalProps {
  participant: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
  serverError?: string | null;
}

interface JuryMember {
  id: string;
  fullName: string;
  qualification: string;
  juryId?:string;
}

const EUROVISION_SCORES = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12];

export function EvaluateModal({ participant, onClose, onSubmit, serverError }: EvaluateModalProps) {
  const [tour, setTour] = useState("1");
  const [selectedJuryId, setSelectedJuryId] = useState("");
  const [selectedScore, setSelectedScore] = useState<number | null>(null);

  const { data: juryList, loading: juryLoading } = useApi<JuryMember>('http://localhost:8080/api/jury');

  useEffect(() => {
    if (participant) {
      setSelectedScore(null); 
    }
  }, [participant]);

  useEffect(() => {
    if (juryList && juryList.length > 0 && !selectedJuryId) {
      setSelectedJuryId(juryList[0].id);
    }
  }, [juryList, selectedJuryId]);

  if (!participant) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedScore || !juryList) return;

  const currentJury = juryList.find(j => 
    j.id === selectedJuryId || 
    j.juryId === selectedJuryId || 
    j.fullName === selectedJuryId
  );

  const finalId = currentJury?.id || currentJury?.juryId;

  const payload = {
    juryId: finalId, 
    tourNumber: Number(tour),
    judgeName: currentJury?.fullName || 'не відомий журі',
    votes: [
      {
        participantId: participant.id,
        score: selectedScore
      }
    ]
  };

  if (!payload.juryId) {
    return;
  }

  onSubmit(payload);
};

  const sfScore = (participant.tour1Score || 0) + (participant.tour2Score || 0);
  const hasPerformedInSF = sfScore > 0;
  const isQualified = sfScore >= 20; 

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-4xl shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-md animate-in zoom-in-95 duration-300 relative">
        
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Голосування Журі</h1>
        <p className="text-neutral-400 mb-6 pb-6 border-b border-neutral-800 flex items-center gap-2">
          Учасник: <strong className="text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-orange-400 text-lg">{participant.firstName} {participant.lastName}</strong>
        </p>
        
        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-8">
         
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Етап</label>
              <select 
                value={tour}
                onChange={(e) => setTour(e.target.value)}
                className="w-full border border-neutral-700 bg-neutral-800 text-white p-3.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold transition-all cursor-pointer appearance-none"
              >
                <option value="1">Півфінал 1</option>
                <option value="2">Півфінал 2</option>
                <option value="3" disabled={hasPerformedInSF && !isQualified}>
                  🏆 Фінал {!hasPerformedInSF ? "(Очікує)" : !isQualified ? "❌ Не кваліф." : "✨ ДОСТУПНО"}
                </option>
              </select>
            </div>

            <div>
               <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Суддя</label>
               {juryLoading ? (
                 <div className="w-full border border-neutral-700 bg-neutral-800 text-neutral-500 p-3.5 rounded-xl font-bold animate-pulse text-sm flex items-center h-13">
                   Завантаження...
                 </div>
               ) : juryList.length === 0 ? (
                 <div className="w-full border border-rose-900/50 bg-rose-950/30 text-rose-500 p-3.5 rounded-xl font-bold text-xs flex items-center h-13">
                   Додайте журі!
                 </div>
               ) : (
                 <select 
                   value={selectedJuryId}
                   onChange={(e) => setSelectedJuryId(e.target.value)}
                   required
                   className="w-full border border-neutral-700 bg-neutral-800 text-white p-3.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold transition-all cursor-pointer appearance-none"
                 >
                   {juryList.map(j => (
                     <option key={j.id} value={j.id}>
                       {j.fullName}
                     </option>
                   ))}
                 </select>
               )}
            </div>
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-bold text-neutral-300 uppercase tracking-wider mb-4 text-center">
              Оберіть бал
            </label>
            
            <div className="grid grid-cols-5 gap-3">
              {EUROVISION_SCORES.map((score) => {
                const isSelected = selectedScore === score;
                const isLegendary12 = score === 12;

                return (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setSelectedScore(score)}
                    className={`relative p-3 rounded-xl font-black text-xl transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                      isSelected && !isLegendary12
                        ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] border border-indigo-400"
                        : isSelected && isLegendary12
                        ? "bg-linear-to-r from-yellow-400 to-amber-600 text-neutral-900 shadow-[0_0_25px_rgba(251,191,36,0.6)] border border-yellow-300"
                        : isLegendary12
                        ? "bg-neutral-800 text-yellow-500 border border-yellow-500/30 hover:bg-yellow-500/10"
                        : "bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-700 hover:text-white"
                    }`}
                  >
                    {score}
                    {isLegendary12 && isSelected && (
                      <Trophy size={14} className="absolute -top-2 -right-2 text-yellow-300 drop-shadow-md" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {serverError && (
            <div className="mb-6 p-4 bg-rose-950/50 border border-rose-900 rounded-xl flex items-start gap-3 backdrop-blur-md">
              <span className="text-rose-500 text-lg">⚠️</span>
              <p className="text-rose-200 text-sm font-medium leading-relaxed">{serverError}</p>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={!selectedScore || juryList.length === 0} 
            className={`w-full py-4 rounded-xl font-extrabold shadow-lg transition-all text-lg tracking-wide uppercase ${
              (!selectedScore || juryList.length === 0)
                ? "bg-neutral-800 text-neutral-600 cursor-not-allowed border border-neutral-800" 
                : selectedScore === 12
                ? "bg-linear-to-r from-yellow-500 to-amber-600 text-neutral-950 hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]"
                : "bg-linear-to-r from-indigo-600 to-blue-600 text-white hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]"
            }`}
          >
            {selectedScore === 12 ? "Douze Points!" : selectedScore ? `Віддати ${selectedScore} балів` : "Оберіть бал"}
          </button>
        </form>
      </div>
    </div>
  );
}