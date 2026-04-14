import { useForm } from "react-hook-form";
import { Briefcase, FileText, UserPlus, X } from "lucide-react";
import DropDowmMenu from "./DropDownMenu"; 
import { HostForm } from "../types";


interface AddHostModalProps {
  onClose: () => void;
  onAdd: (data: HostForm) => Promise<boolean>;
}

export default function AddHostModal({ onClose, onAdd }: AddHostModalProps) {
  const { register, handleSubmit, reset, watch, setValue } = useForm<HostForm>();

  const onSubmit = async (data: HostForm) => {
    const success = await onAdd(data);
    if (success) {
      reset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-100 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0a0a0a] rounded-4xl border border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-md flex flex-col relative overflow-visible">
        
        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-green-500 to-emerald-500"></div>

        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3 text-white">
            <UserPlus size={22} className="text-emerald-500" />
            <h2 className="text-xl font-black uppercase tracking-wide">Новий учасник</h2>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="p-8 flex flex-col gap-6">
            <div>
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <FileText size={14} className="text-emerald-500"/> Ім'я та Прізвище
              </label>
              <input 
                {...register('fullname', { required: true })} 
                placeholder="Наприклад: Тімур Мірошниченко"
                className="w-full p-4 bg-neutral-900 border border-neutral-700 rounded-2xl outline-none focus:bg-neutral-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm text-white placeholder:text-neutral-600 font-medium" 
              />
            </div>
            <div>
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Briefcase size={14} className="text-emerald-500"/> Роль на фестивалі
              </label>
              <input type="hidden" {...register('role',{required:true})}/>
    
              <div className="bg-neutral-900 border border-neutral-700 rounded-2xl focus-within:ring-2 focus-within:ring-emerald-500/50 relative z-50">
                <DropDowmMenu 
                  value={watch('role')}
                  onChange={(val) => setValue('role', val, { shouldValidate: true })}
                />
              </div>
            </div>
          </div>

          <div className="px-8 py-5 bg-black/40 border-t border-white/5 flex justify-end gap-3 rounded-b-4xl">
            <button type="button" onClick={onClose} className="px-6 py-3 text-sm font-bold text-neutral-400 bg-transparent hover:text-white rounded-full transition-colors">
              Скасувати
            </button>
            <button type="submit" className="px-8 py-3 text-sm font-black text-white bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2 uppercase tracking-wide">
              Додати <UserPlus size={16}/>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}