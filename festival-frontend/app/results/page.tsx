"use client"

import { useApi } from "../hooks/useApi";
import { Trophy, Star, Music, Mic, Hourglass } from "lucide-react";

interface FinalResult {
  id: string;
  firstName: string;
  lastName: string;
  performanceGenre: string;
  tour3Score: number; 
  publicVotes: number;
  finalScore: number; 
  photoBase64:string;
}

export default function ResultsPage() {
  
  const { data: results, loading } = useApi<FinalResult>('http://localhost:8080/api/participants/final-results');

  if (loading) return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
      <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-xl font-black uppercase tracking-widest animate-pulse">Підрахунок результатів...</p>
    </div>
  );

  const sortedResults = results || [];
  
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

        <div className="bg-[#111322]/60 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/5 text-neutral-400 text-xs font-black uppercase tracking-widest">
                <th className="py-6 px-8 text-left w-20">Порядок</th>
                <th className="py-6 px-4 text-left">Учасник</th>
                <th className="py-6 px-4 text-center hidden md:table-cell">Журі</th>
                <th className="py-6 px-4 text-center hidden md:table-cell">Публіка</th>
                <th className="py-6 px-8 text-right">Загальний результат</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sortedResults.map((res, index) => {
                const isWinner = index === 0 && hasVotes;
                const isTop3 = index < 3;

                return (
                  <tr 
                    key={res.id} 
                    className={`group transition-colors hover:bg-white/2 ${isWinner ? 'bg-yellow-500/3' : ''}`}
                  >
                    <td className="py-6 px-8">
                      <div className={`text-2xl font-black ${isWinner ? 'text-yellow-500' : isTop3 ? 'text-white' : 'text-neutral-600'}`}>
                        {index + 1}
                      </div>
                    </td>

                    <td className="py-6 px-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${isWinner ? 'border-yellow-500' : 'border-white/10'}`}>
                          <img 
                            src={res.photoBase64 || `https://api.dicebear.com/7.x/notionists/svg?seed=${res.id}`} 
                            alt={`${res.firstName} ${res.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-black text-white uppercase tracking-tight leading-none mb-1 flex items-center gap-2">
                            {res.firstName} {res.lastName}
                            {isWinner && <Trophy size={16} className="text-yellow-500 fill-yellow-500" />}
                          </div>
                          <div className="text-xs font-bold text-neutral-500 uppercase flex items-center gap-1">
                            <Music size={10} /> {res.performanceGenre}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-6 px-4 text-center hidden md:table-cell">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-white">{res.tour3Score || 0}</span>
                        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-tighter">Журі</span>
                      </div>
                    </td>

                    <td className="py-6 px-4 text-center hidden md:table-cell">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-pink-500">
                          {(res.finalScore || 0) - (res.tour3Score || 0)} 
                        </span>
                        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-tighter">Публіка</span>
                      </div>
                    </td>

                    <td className="py-6 px-8 text-right">
                      <div className={`text-3xl font-black tracking-tighter ${isWinner ? 'text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'text-white'}`}>
                        {res.finalScore || 0}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {sortedResults.length > 0 && (
          <div className="mt-20">
            {hasVotes ? (
              <div className="relative animate-in zoom-in duration-1000 delay-300">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/20 blur-[80px] rounded-full"></div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative mb-8 group">
                    <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative bg-linear-to-b from-neutral-800 to-neutral-950 p-8 rounded-full border border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.3)]">
                      <Mic size={80} className="text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" strokeWidth={1.5} />
                      <Star size={24} className="absolute -top-2 -right-2 text-yellow-400 fill-yellow-400 animate-pulse" />
                    </div>
                  </div>

                  <div className="text-center">
                    <h2 className="text-sm font-black text-yellow-500 uppercase tracking-[0.8em] mb-4">
                      Кришталевий мікрофон отримує...
                    </h2>
                    
                    <div className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                      {sortedResults[0].firstName} <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-amber-600">{sortedResults[0].lastName}</span>
                    </div>

                    <div className="inline-flex items-center gap-4 px-8 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                      <div className="flex flex-col items-start border-r border-white/10 pr-4">
                          <span className="text-[10px] font-black text-neutral-500 uppercase">Загальний результат</span>
                          <span className="text-2xl font-black text-white">{sortedResults[0].finalScore}</span>
                      </div>
                      <div className="flex flex-col items-start pl-2">
                          <span className="text-[10px] font-black text-neutral-500 uppercase">Статус</span>
                          <span className="text-sm font-bold text-yellow-500 uppercase tracking-widest italic">Абсолютний чемпіон</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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