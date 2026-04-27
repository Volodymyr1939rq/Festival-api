import { QrCode, Trash2, Heart, CheckCircle2 } from 'lucide-react';

interface Spectator {
  id: string;
  fullName: string;
  ticketNumber: string;
}

interface SpectatorCardProps {
  spectator: Spectator;
  hasVoted: boolean;
  onDelete: (id: string) => void;
  onVoteClick: (id: string) => void;
  isAdmin?:boolean;
}

export default function SpectatorCard({ spectator, hasVoted, onDelete, onVoteClick,isAdmin}: SpectatorCardProps) {
  return (
    <div className="relative bg-[#111322] rounded-4xl shadow-2xl border border-white/10 overflow-hidden hover:border-pink-500/50 transition-colors group flex flex-col">
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
          {isAdmin && (
          <button 
            onClick={() => onDelete(spectator.id)}
            className="p-2 text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-colors"
            title="Анулювати квиток"
          >
            <Trash2 size={18} />
          </button>
          )}
        </div>

        <button 
          onClick={() => !hasVoted && onVoteClick(spectator.id)}
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
}