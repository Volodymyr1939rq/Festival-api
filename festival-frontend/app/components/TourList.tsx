"use client"

import { Mic, Music, Plus } from "lucide-react"; 
import { CountryBadge } from "./CountryBadge";

interface TourListProps {
  title: string;
  highlightedWord: string;
  participants: any[];
  onRateClick: (p: any) => void;
  currentTour: number;
}

export function TourList({ title, highlightedWord, participants, onRateClick, currentTour }: TourListProps) {
  return (
    <div className="bg-[#0A0A16] p-6 sm:p-8 rounded-4xl border border-neutral-800/50 shadow-2xl w-full mx-auto my-4 animate-in fade-in duration-500">
      
      <h2 className="text-3xl font-extrabold text-white mb-8 tracking-wide">
        {title} <span className="text-pink-500">{highlightedWord}</span>
      </h2>

      <div className="flex flex-col gap-4">
        {participants.map((p) => {
          const displayScore = currentTour === 1 ? p.tour1Score : currentTour === 2 ? p.tour2Score : p.tour3Score;

          return (
            <div key={p.id} className="group flex flex-col xl:flex-row items-start xl:items-center justify-between p-3 pr-4 rounded-3xl xl:rounded-full bg-linear-to-r from-blue-900/40 via-purple-900/20 to-transparent border border-white/5 hover:border-white/10 transition-all gap-4">
              
              <div className="flex items-center flex-wrap sm:flex-nowrap gap-3 w-full xl:w-auto flex-1">
                
                <div className="flex flex-col items-center justify-center w-12 sm:w-16 shrink-0 border-r border-white/10 pr-2 sm:pr-4 group-hover:border-white/30 transition-colors">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">
                    Order
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-neutral-400 drop-shadow-md">
                    {p.performanceOrder || "-"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 pl-1 sm:pl-2">
                  {p.country && <CountryBadge country={p.country}/>}

                  <div className="bg-white/5 border border-white/10 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2">
                    <Mic size={14} className="text-blue-300 shrink-0" />
                    <span className="truncate max-w-30 sm:max-w-50">{p.firstName} {p.lastName}</span>
                  </div>

                  <div className="bg-white/5 border border-white/10 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2">
                    <Music size={14} className="text-purple-300 shrink-0" />
                    <span className="truncate max-w-25 sm:max-w-37.5">{p.performanceGenre}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full xl:w-auto justify-end shrink-0 mt-2 xl:mt-0">
                <div className="bg-black/40 text-neutral-300 px-5 py-2 rounded-full text-sm font-bold border border-white/5 mr-1 sm:mr-2">
                  {displayScore > 0 ? displayScore : "-"} оцінка
                </div>
                
                <button onClick={() => onRateClick(p)} className="w-10 h-10 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all shrink-0 shadow-sm">
                  <Plus size={20} strokeWidth={3} />
                </button>
              </div>

            </div>
          );
        })}

        {participants.length === 0 && (
          <div className="text-center py-10 text-neutral-500 font-medium border border-dashed border-neutral-800 rounded-3xl">
            У цьому списку поки немає учасників.
          </div>
        )}
      </div>
    </div>
  );
}