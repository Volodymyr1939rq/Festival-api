import { Mic, Star } from "lucide-react";
import { FinalResult } from "../types";

interface WinnerAnnouncementProps {
  winner: FinalResult;
}

export default function WinnerAnnouncement({ winner }: WinnerAnnouncementProps) {
  return (
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
            {winner.firstName} <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-amber-600">{winner.lastName}</span>
          </div>

          <div className="inline-flex items-center gap-4 px-8 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
            <div className="flex flex-col items-start border-r border-white/10 pr-4">
                <span className="text-[10px] font-black text-neutral-500 uppercase">Загальний результат</span>
                <span className="text-2xl font-black text-white">{winner.finalScore}</span>
            </div>
            <div className="flex flex-col items-start pl-2">
                <span className="text-[10px] font-black text-neutral-500 uppercase">Статус</span>
                <span className="text-sm font-bold text-yellow-500 uppercase tracking-widest italic">Абсолютний чемпіон</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}