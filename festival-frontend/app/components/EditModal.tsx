import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Camera, Music, Globe } from 'lucide-react';
import { CountrySelect } from './CountrySelect';
import { error } from 'console';

interface EditFormData {
  firstName: string;
  lastName: string;
  songTitle: string;
  country: string;  
  performanceGenre: string;
  venueName: string;
  equipment: string[];
  props: string[];
  photoBase64?: string; 
}

interface EditModalProps {
  participant: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function EditModal({ participant, onClose, onSubmit }: EditModalProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const getInitialValues = () => {
    if (!participant) return {};
    return {
      firstName: participant.firstName,
      lastName: participant.lastName,
      songTitle: participant.songTitle || '',
      country: participant.country || '',
      performanceGenre: participant.performanceGenre,
      venueName: participant.venue?.name || 'Головна сцена',
      equipment: participant.equipments ? participant.equipments.map((eq: any) => eq.name) : [],
      props: participant.proplist ? participant.proplist.map((p: any) => p.title) : [],
      photoBase64: participant.photoBase64 || ''
    }
  }

  const { register, handleSubmit, setValue, watch, reset,formState:{errors} } = useForm<EditFormData>({
    defaultValues: getInitialValues()
  });

  const selectedCountry=watch('country')

  useEffect(() => {
    if (participant) {
      reset(getInitialValues());
      setPreviewImage(participant.photoBase64 || null);
    }
  }, [participant, reset]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        setValue('photoBase64', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!participant) return null;

  const handleFormSubmit = (data: EditFormData) => {
    const payload = {
      ...data,
      venue: {
        name: data.venueName,
        capacity: data.venueName === "Головна сцена" ? 500 : 150
      },
      equipments: data.equipment ? data.equipment.map(eq => ({ name: eq, quantity: 1 })) : [],
      proplist: data.props ? data.props.map((p, index) => ({ title: p, propNumber: index + 1 })) : []
    };
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center z-100 p-4 sm:p-8 transition-all">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0c0d18]/95 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 overflow-y-auto p-6 sm:p-10 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
          
          <div className="flex items-center justify-between mb-8">
            <div>
               <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Редагувати</h2>
               <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mt-1">Оновлення даних учасника</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 border border-white/5 transition-all font-light text-2xl">✕</button>
          </div>
          
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-10">
            
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/5 bg-neutral-900 flex items-end justify-center">
                  {previewImage ? (
                    <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <User size={82} className="text-neutral-700 translate-y-1" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer border-4 border-[#0c0d18] hover:bg-indigo-500 transition-all">
                  <Camera size={18} className="text-white" />
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black text-indigo-500 uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="h-px w-8 bg-indigo-500/50"></span> Персональна інформація
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="flex text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2 px-1">Ім'я</label>
                  <input {...register('firstName', { required: true })} className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="flex text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2 px-1">Прізвище</label>
                  <input {...register('lastName', { required: true })} className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="flex text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2 px-1 items-center gap-2">
                    <Music size={10}/> Назва пісні
                  </label>
                  <input {...register('songTitle', { required: true })} className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="flex text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2 px-1 items-center gap-2">
                    <Globe size={10}/> Країна
                  </label>
                  <CountrySelect 
                  value={selectedCountry || ''}
                  name='country'
                  onChange={(val)=>setValue('country',val,{shouldValidate:true,shouldDirty:true})}/>
                   <input type='hidden' {...register('country', { required: true })} />
                   {errors.country && (
                    <p className='text-[9px] text-red-500 font-bold uppercase mt-2 ml-1'>
                      Будь ласка,оберіть країну
                    </p>
                   )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black text-pink-500 uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="h-px w-8 bg-pink-500/50"></span> Деталі виступу
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="flex text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2 px-1">Жанр</label>
                  <input {...register('performanceGenre', { required: true })} className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2 px-1">Сцена</label>
                  <select {...register('venueName')} className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer">
                    <option value="Головна сцена" className="bg-neutral-900 text-white">Головна сцена</option>
                    <option value="Малий зал" className="bg-neutral-900 text-white">Малий зал</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/5 p-8 rounded-4xl border border-white/10">
              <div>
                <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Обладнання</label>
                <div className="grid grid-cols-1 gap-3">
                  {['Радіомікрофон', 'Стійка', 'Проєктор', 'Монітори'].map((item) => (
                    <label key={item} className="flex items-center gap-3 text-sm font-bold text-neutral-400 cursor-pointer hover:text-white transition-all group">
                      <input type="checkbox" value={item} {...register('equipment')} className="w-5 h-5 rounded-lg border-2 border-white/10 bg-transparent checked:bg-indigo-600 transition-all cursor-pointer" />
                      {item}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-pink-400 uppercase tracking-widest mb-4">Реквізит</label>
                <div className="grid grid-cols-1 gap-3">
                  {['Стілець', 'Стіл', 'Фортепіано', 'Ширма'].map((item) => (
                    <label key={item} className="flex items-center gap-3 text-sm font-bold text-neutral-400 cursor-pointer hover:text-white transition-all group">
                      <input type="checkbox" value={item} {...register('props')} className="w-5 h-5 rounded-lg border-2 border-white/10 bg-transparent checked:bg-pink-600 transition-all cursor-pointer" />
                      {item}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button type="button" onClick={onClose} className="flex-1 px-8 py-4 rounded-2xl font-black text-neutral-400 bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest text-xs">
                Скасувати
              </button>
              <button type="submit" className="flex-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-indigo-600/20 transition-all transform hover:-translate-y-1 active:scale-95">
                Оновити профіль
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}