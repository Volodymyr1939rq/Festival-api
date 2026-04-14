import { Trophy, Music, User } from "lucide-react";
import { FinalResult } from "../types";

interface ResultsTableProps {
  results: FinalResult[];
  hasVotes: boolean;
}

export default function ResultsTable({ results, hasVotes }: ResultsTableProps) {
  return (
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
          {results.map((res, index) => {
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
                    <div className={`relative w-12 h-12 shrink-0 rounded-full overflow-hidden border-2 flex items-end justify-center bg-neutral-800 ${isWinner ? 'border-yellow-500' : 'border-white/10'}`}>
                      {res.photoBase64 ? (
                        <img 
                          src={res.photoBase64} 
                          alt={`${res.firstName} ${res.lastName}`}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <User size={40} strokeWidth={1.5} className="text-neutral-500 translate-y-2 opacity-80" />
                      )}
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
  );
}