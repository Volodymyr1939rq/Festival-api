import React from 'react';

interface DeleteModalProps {
  participants: any;
  onClose: () => void;
  onComfirm: (id: string) => void; 
}

export default function DeleteModal({ participants, onClose, onComfirm }: DeleteModalProps) {
  if (!participants) return null;

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      

      <div className="relative bg-[#111322]/90 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-sm animate-in zoom-in-95 duration-200 text-center overflow-hidden">
        
       
        <div className="absolute top-[-50%] left-[-20%] w-full h-full bg-rose-600/10 blur-[60px] rounded-full pointer-events-none z-0"></div>
        
        <div className="relative z-10">
          
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(225,29,72,0.2)]">
            <span className="text-2xl drop-shadow-[0_0_8px_rgba(225,29,72,0.8)]">⚠️</span>
          </div>

          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
            Видалити учасника?
          </h2>
          
          <p className="text-sm font-bold text-neutral-400 mb-8 leading-relaxed">
            Ви збираєтесь видалити <span className="text-rose-400 border-b border-rose-400/30 pb-0.5">{participants.firstName} {participants.lastName}</span>. Цю дію неможливо скасувати.
          </p>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose} 
              className="flex-1 px-5 py-3 rounded-xl font-bold text-neutral-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              Скасувати
            </button>
            <button 
              onClick={() => onComfirm(participants.id)} 
              className="flex-1 px-5 py-3 rounded-xl font-black uppercase tracking-widest text-white bg-linear-to-r from-rose-600 to-red-600 shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] transition-all transform hover:-translate-y-0.5"
            >
              Видалити
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}