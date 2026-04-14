import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Ticket, User, QrCode, X } from 'lucide-react';

interface SpectatorForm {
  fullName: string;
  ticketNumber: string;
}

interface AddSpectatorModalProps {
  spectators: any[];
  onClose: () => void;
  onAdd: (data: SpectatorForm) => Promise<boolean | undefined>;
}

export default function AddSpectatorModal({ spectators, onClose, onAdd }: AddSpectatorModalProps) {
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SpectatorForm>({
    mode: 'onChange'
  });

  const onSubmit = async (data: SpectatorForm) => {
    setError(null);
    const isSeatSpectator = spectators.some(s => s.ticketNumber.toLowerCase().trim() === data.ticketNumber.toLowerCase().trim());
    
    if (isSeatSpectator) {
      setError(`Місце ${data.ticketNumber} уже зайняте, виберіть інше.`);
      return;
    }
    
    const success = await onAdd(data);
    if (success) {
      reset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-100 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0a0a0a] rounded-4xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-neutral-800 w-full max-w-sm flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-blue-500 to-indigo-500"></div>
        
        <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3 text-white">
            <Ticket size={20} className="text-indigo-400" />
            <h2 className="text-lg font-black uppercase tracking-wide">Реєстрація квитка</h2>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="p-6 flex flex-col gap-5">
            <div>
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <User size={14} className="text-indigo-400" /> Ім'я та Прізвище
              </label>
              <input 
                {...register('fullName', { required: true })} 
                placeholder="Напр. Марія Петренко"
                className="w-full p-4 bg-neutral-900 border border-neutral-700 rounded-2xl outline-none focus:bg-neutral-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-white placeholder:text-neutral-600" 
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <QrCode size={14} className="text-indigo-400" /> Ряд та Місце
              </label>
              <input 
                {...register('ticketNumber', { 
                  required: 'Вкажіть місце',
                  pattern: {
                    value: /^(Ряд\s*\d+[\s,]*Місце\s*\d+|\d+\s*-\s*\d+)$/i,
                    message: "Формат: 'Ряд 5,Місце 12' або '5-12'"
                  }
                })} 
                placeholder="Напр. Ряд 5, Місце 12"
                className="w-full p-4 bg-neutral-900 border border-neutral-700 rounded-2xl outline-none focus:bg-neutral-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono font-bold text-white uppercase placeholder:text-neutral-600" 
              />
              {errors.ticketNumber && (
                <p className='text-rose-400 text-[10px] font-bold uppercase ml-1 mt-2 animate-in fade-in'>
                  {errors.ticketNumber.message}
                </p>
              )}
            </div> 
            {error && (
              <div className='p-3 bg-rose-500/10 border border-rose-500/50 rounded-xl text-rose-400 text-sm font-bold flex items-center gap-2 animate-in fade-in zoom-in-95'>
                <X size={16}/> {error}
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-black/40 border-t border-white/5 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-neutral-400 hover:text-white rounded-full transition-colors">
              Скасувати
            </button>
            <button type="submit" className="px-6 py-2.5 text-sm font-black text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-full shadow-lg transition-all active:scale-95 uppercase tracking-wide">
              Зареєструвати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}