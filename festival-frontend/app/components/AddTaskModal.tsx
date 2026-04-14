import { useForm } from "react-hook-form";
import { CheckCircle2, FileText, LayoutList, X } from "lucide-react";
import { TaskForm } from "../types";

interface AddTaskModalProps {
  onClose: () => void;
  onAdd: (data: TaskForm) => Promise<boolean>;
}

export default function AddTaskModal({ onClose, onAdd }: AddTaskModalProps) {
  const { register, handleSubmit, reset } = useForm<TaskForm>();

  const onSubmit = async (data: TaskForm) => {
    const success = await onAdd(data);
    if (success) {
      reset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-100 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0a0a0a] rounded-4xl border border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-lg overflow-hidden flex flex-col relative">
        
        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-blue-600 via-purple-500 to-pink-500"></div>
        
        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3 text-white">
            <LayoutList size={22} className="text-pink-500" />
            <h2 className="text-xl font-black uppercase tracking-wide">Створити завдання</h2>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="p-8 flex flex-col gap-6">
            <div>
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-indigo-500"/> Короткий підсумок
              </label>
              <input 
                {...register('title', { required: true })} 
                placeholder="Наприклад: Налаштувати світло"
                className="w-full p-4 bg-neutral-900 border border-neutral-700 rounded-2xl outline-none focus:bg-neutral-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all text-sm text-white placeholder:text-neutral-600 font-medium" 
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <FileText size={14} className="text-indigo-500"/> Детальний опис
              </label>
              <textarea 
                {...register('description', { required: true })} 
                placeholder="Вкажіть техніку, приміщення або реквізит..."
                className="w-full p-4 bg-neutral-900 border border-neutral-700 rounded-2xl outline-none focus:bg-neutral-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all text-sm text-white placeholder:text-neutral-600 resize-none h-32 font-medium" 
              />
            </div>
          </div>

          <div className="px-8 py-5 bg-black/40 border-t border-white/5 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-3 text-sm font-bold text-neutral-400 bg-transparent hover:text-white rounded-full transition-colors">
              Скасувати
            </button>
            <button type="submit" className="px-8 py-3 text-sm font-black text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2 uppercase tracking-wide">
              Зберегти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}