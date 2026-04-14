import { Phone, X, Heart } from 'lucide-react';
import { Participant } from '../types'; // Якщо виніс типи, якщо ні - додай сюди

interface VotingModalProps {
  participants: Participant[] | null;
  loading: boolean;
  onClose: () => void;
  onVote: (id: string) => void;
}

export default function VotingModal({ participants, loading, onClose, onVote }: VotingModalProps) {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-100 p-4 backdrop-blur-xl animate-in zoom-in-95 duration-300">
      <div className="bg-[#050505] rounded-4xl border border-pink-500/30 shadow-[0_0_100px_rgba(236,72,153,0.3)] w-full max-w-4xl h-[80vh] flex flex-col relative overflow-hidden">
        
        <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-linear-to-r from-pink-600/20 to-purple-900/20">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <Phone size={28} className="text-pink-500 animate-pulse" />
              Віддати свій голос
            </h2>
            <p className="text-neutral-400 mt-1 font-medium">Оберіть свого фаворита. Ви можете проголосувати лише один раз!</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {loading ? (
            <div className="text-center text-neutral-500 font-bold mt-20">Підключення до сцени...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {participants?.map(p => (
                <button 
                  key={p.id}
                  onClick={() => onVote(p.id)}
                  className="group relative rounded-3xl overflow-hidden aspect-square text-left transition-all hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] focus:outline-none focus:ring-4 focus:ring-pink-500"
                >
                  <img 
                    src={p.photoBase64 || `https://api.dicebear.com/7.x/notionists/svg?seed=${p.id}&backgroundColor=374151`} 
                    alt="Participant" 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent"></div>
                  
                  <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col">
                    <span className="text-xs font-black text-pink-500 uppercase tracking-widest mb-1">{p.performanceGenre}</span>
                    <span className="text-2xl font-black text-white uppercase leading-none">{p.firstName}</span>
                    <span className="text-lg font-bold text-neutral-300 uppercase">{p.lastName}</span>
                  </div>

                  <div className="absolute inset-0 bg-pink-600/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <Heart size={48} className="text-white mb-2 animate-bounce" fill="currentColor" />
                    <span className="text-white font-black text-xl uppercase tracking-widest">Проголосувати</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}