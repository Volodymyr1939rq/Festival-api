"use client"

import { useApi } from "../hooks/useApi";
import { Trophy, Hourglass } from "lucide-react";
import { FinalResult } from "../types";
import ResultsTable from "../components/ResultsTable";
import WinnerAnnouncement from "../components/WinnerAnnouncement";

export default function ResultsPage() {
  const { data: results, loading } = useApi<FinalResult>(process.env.NEXT_PUBLIC_API_URL + '/api/participants/final-results');

  if (loading) return (
    <div className="min-h-screen bg-[#06041a] flex flex-col items-center justify-center text-white">
      <div className="w-16 h-16 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(217,70,239,0.5)]"></div>
      <p className="text-xl font-black uppercase tracking-widest animate-pulse text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-fuchsia-400 to-rose-400">
        Підрахунок результатів...
      </p>
    </div>
  );

  const sortedResults = [...(results || [])].sort((a, b) => {
    const finalA = a.finalScore || 0;
    const finalB = b.finalScore || 0;
    
    if (finalB !== finalA) return finalB - finalA;

    const publicA = finalA - (a.tour3Score || 0);
    const publicB = finalB - (b.tour3Score || 0);
    
    if (publicB !== publicA) return publicB - publicA; 
    
    return (b.tour3Score || 0) - (a.tour3Score || 0);
  });
  
  const hasVotes = sortedResults.some(res => res.finalScore > 0);

  return (
    <main className="min-h-screen bg-[#06041a] text-white font-sans relative pt-24 pb-20 overflow-hidden">
      
      {/* Динамічні градієнтні плями (Стиль United by Music) */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-rose-600/25 blur-[130px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute top-[5%] right-[-10%] w-[45vw] h-[45vw] bg-blue-600/25 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[5%] right-[5%] w-[50vw] h-[50vw] bg-fuchsia-600/20 blur-[140px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-15%] left-[-5%] w-[45vw] h-[45vw] bg-pink-600/20 blur-[130px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto p-6 relative z-10">
        
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-fuchsia-400 to-rose-400 tracking-tight mb-6 uppercase italic drop-shadow-xl">
            Таблиця результатів
          </h1>
          <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md shadow-lg">
            <Trophy className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" size={20} />
            <span className="text-sm font-black uppercase tracking-[0.3em] text-white/90">Гранд фінал</span>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <ResultsTable results={sortedResults} hasVotes={hasVotes} />
        </div>
        
        {sortedResults.length > 0 && (
          <div className="mt-20">
            {hasVotes ? (
              <div className="animate-in zoom-in duration-1000 delay-300">
                <WinnerAnnouncement winner={sortedResults[0]} />
              </div>
            ) : (
              <div className="relative flex flex-col items-center justify-center py-16 bg-white/5 border border-white/10 rounded-4xl backdrop-blur-md shadow-2xl animate-in fade-in duration-700">
                <Hourglass size={56} className="text-fuchsia-400 mb-6 animate-pulse drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]" />
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 text-center">
                  Очікування результатів
                </h2>
                <p className="text-white/50 text-sm font-bold uppercase tracking-widest text-center px-4">
                  Переможця буде визначено після підрахунку балів
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}