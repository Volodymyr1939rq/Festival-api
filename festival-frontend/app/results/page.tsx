"use client"

import { useApi } from "../hooks/useApi";
import { Trophy, Hourglass } from "lucide-react";
import { FinalResult } from "../types";
import ResultsTable from "../components/ResultsTable";
import WinnerAnnouncement from "../components/WinnerAnnouncement";

export default function ResultsPage() {
  const { data: results, loading } = useApi<FinalResult>(process.env.NEXT_PUBLIC_API_URL + '/api/participants/final-results');

  if (loading) return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
      <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-xl font-black uppercase tracking-widest animate-pulse">Підрахунок результатів...</p>
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
    <main className="min-h-screen bg-neutral-950 text-white font-sans relative pt-24 pb-20 overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-pink-600/20 blur-[150px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto p-6 relative z-10">
        
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-neutral-500 tracking-tighter uppercase mb-4">
            Таблиця результатів
          </h1>
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            <Trophy className="text-yellow-500" size={20} />
            <span className="text-sm font-black uppercase tracking-[0.3em]">Гранд фінал</span>
          </div>
        </div>

        <ResultsTable results={sortedResults} hasVotes={hasVotes} />
        
        {sortedResults.length > 0 && (
          <div className="mt-20">
            {hasVotes ? (
     
              <WinnerAnnouncement winner={sortedResults[0]} />
            ) : (
              <div className="relative flex flex-col items-center justify-center opacity-60 py-10">
                <Hourglass size={48} className="text-neutral-500 mb-6 animate-pulse" />
                <h2 className="text-2xl font-black text-neutral-400 uppercase tracking-[0.3em] mb-2">
                  Очікування результатів
                </h2>
                <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest">
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