import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface EditFormData {
  firstName: string;
  lastName: string;
  groupName: string;
  performanceGenre: string;
  venueName: string;
  equipment: string[];
  props: string[];
}

interface EditModalProps {
  participant: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function EditModal({ participant, onClose, onSubmit }: EditModalProps) {
  const getInitialValues = () => {
    if (!participant) return {};
    return {
      firstName: participant.firstName,
      lastName: participant.lastName,
      groupName: participant.groupName,
      performanceGenre: participant.performanceGenre,
      venue: participant.venue?.name || 'Головна сцена',
      equipment: participant.equipments ? participant.equipments.map((eq: any) => eq.name) : [],
      props: participant.proplist ? participant.proplist.map((p: any) => p.title) : []
    }
  }

  const { register, handleSubmit, formState: { errors }, reset } = useForm<EditFormData>({
    defaultValues: getInitialValues()
  })

  useEffect(() => {
    if (participant)
      reset(getInitialValues())
  }, [participant, reset])

  if (!participant) return null;

  const handleFormSubmit = (data: EditFormData) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      groupName: data.groupName,
      performanceGenre: data.performanceGenre,
      venue: {
        name: data.venueName,
        capacity: data.venueName === "Головна сцена" ? 500 : 150
      },
      equipments: data.equipment ? data.equipment.map(eq => ({ name: eq, quantity: 1 })) : [],
      proplist: data.props ? data.props.map((p, index) => ({ title: p, propNumber: index + 1 })) : []
    }
    onSubmit(payload)
  }

  return (
    // Змінили p-4 на sm:p-8 для кращих відступів на великих екранах
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-8 transition-all">
      
      {/* Головний контейнер тепер має max-h-[90vh] і flex-col для правильного внутрішнього скролу */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#111322]/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Декоративні фонові плями (не скроляться) */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-pink-600/10 blur-[80px] rounded-full pointer-events-none z-0"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none z-0"></div>

        {/* ВНУТРІШНІЙ КОНТЕНТ ЗІ СКРОЛОМ */}
        {/* Додано стилізований скролбар через класи Tailwind */}
        <div className="relative z-10 overflow-y-auto p-6 sm:p-10 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Редагування профілю</h2>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/5 transition-all font-bold">✕</button>
          </div>
          
          <form onSubmit={handleSubmit(handleFormSubmit)}>
          
            {/* СЕКЦІЯ 1 */}
            <h3 className="text-sm font-black text-pink-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <span className="bg-pink-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px]">1</span>
              Основні дані
            </h3>
            <div className="grid grid-cols-2 gap-5 mb-8">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Ім'я</label>
                <input {...register('firstName', { required: true })} 
                  className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/10 transition-all placeholder:text-white/20" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Прізвище</label>
                <input {...register('lastName', { required: true })} 
                  className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/10 transition-all placeholder:text-white/20" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Група</label>
                <input {...register('groupName', { required: true })} 
                  className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/10 transition-all placeholder:text-white/20" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Жанр</label>
                <input {...register('performanceGenre', { required: true })} 
                  className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/10 transition-all placeholder:text-white/20" />
              </div>
            </div>

            <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8"></div>
            
            {/* СЕКЦІЯ 2 */}
            <h3 className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <span className="bg-indigo-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px]">2</span>
              Технічний райдер
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-black/30 p-6 rounded-2xl border border-white/5 mb-10">
              
              <div>
                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">Локація (Сцена)</label>
                <select {...register('venueName', { required: true })} 
                  className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                  <option value="Головна сцена" className="bg-[#111322]">Головна сцена</option>
                  <option value="Малий зал" className="bg-[#111322]">Малий зал</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">Обладнання</label>
                <div className="space-y-3">
                  {['Радіомікрофон', 'Стійка', 'Проєктор', 'Монітори'].map((item) => (
                    <label key={item} className="flex items-center gap-3 text-sm font-bold text-neutral-300 cursor-pointer hover:text-white transition-colors group">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" value={item} {...register('equipment')} 
                          className="peer appearance-none w-5 h-5 border-2 border-white/20 rounded bg-transparent checked:bg-indigo-500 checked:border-indigo-500 focus:outline-none transition-all cursor-pointer" />
                        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">Реквізит</label>
                <div className="space-y-3">
                  {['Стілець', 'Стіл', 'Фортепіано', 'Ширма'].map((item) => (
                    <label key={item} className="flex items-center gap-3 text-sm font-bold text-neutral-300 cursor-pointer hover:text-white transition-colors group">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" value={item} {...register('props')} 
                          className="peer appearance-none w-5 h-5 border-2 border-white/20 rounded bg-transparent checked:bg-indigo-500 checked:border-indigo-500 focus:outline-none transition-all cursor-pointer" />
                        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {item}
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* КНОПКИ */}
            <div className="flex gap-4 justify-end">
              <button type="button" onClick={onClose} 
                className="px-6 py-3 rounded-xl font-bold text-neutral-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                Скасувати
              </button>
              <button type="submit" 
                className="bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest shadow-[0_0_20px_rgba(219,39,119,0.3)] hover:shadow-[0_0_30px_rgba(219,39,119,0.5)] transition-all transform hover:-translate-y-0.5">
                Зберегти зміни
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}