import { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Upload } from "lucide-react";
import { CountrySelect } from "./CountrySelect";
export interface ParticipantFormData {
  firstName: string;
  lastName: string;
  songTitle: string; 
  performanceGenre: string;
  venueName: string;
  equipment: string[];
  props: string[];
  country?:string;
}

interface AddParticipationProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

export default function AddParticipationsForm({ onSubmit, onCancel }: AddParticipationProps) {
  const { register, handleSubmit,watch,setValue, formState: { errors } } = useForm<ParticipantFormData>();
  
  const selectedCountry=watch('country')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => setPhotoPreview(null);

  const handleFormSubmit = (data: ParticipantFormData) => {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        songTitle: data.songTitle, 
        performanceGenre: data.performanceGenre,
        photoBase64: photoPreview, 
        country:data.country,
        venue: {
          name: data.venueName,
          capacity: data.venueName === "Головна сцена" ? 500 : 150
        },
        equipments: data.equipment ? data.equipment.map(eq => ({ name: eq, quantity: 1 })) : [],
        proplist: data.props ? data.props.map((p, index) => ({ title: p, propNumber: index + 1 })) : []
      }
      onSubmit(payload);
  }

  return (
    <div className="bg-neutral-900 p-8 rounded-4xl border border-neutral-800 shadow-2xl w-full relative">
      
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-neutral-800">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Нова реєстрація учасника</h2>
        <button 
          onClick={onCancel} 
          className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-full transition-colors"
          title="Закрити"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
      
        <div className="mb-8">
          <h3 className="text-sm font-black text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-orange-400 uppercase tracking-widest mb-5">
            1. Основні дані
          </h3>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-neutral-600 bg-neutral-800 flex items-center justify-center overflow-hidden group hover:border-pink-500 transition-colors">
                
                {photoPreview ? (
                  <>
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={removePhoto}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="text-white" size={32} />
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-neutral-400 hover:text-pink-400 transition-colors">
                    <Upload size={28} className="mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-center px-2">Завантажити<br/>Фото</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handlePhotoUpload} 
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Ім'я</label>
                <input 
                  {...register('firstName', { required: true })} 
                  placeholder="Тарас" 
                  className="w-full border border-neutral-700 bg-neutral-800 text-white placeholder-neutral-600 p-3.5 rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Прізвище</label>
                <input 
                  {...register('lastName', { required: true })} 
                  placeholder="Шевченко" 
                  className="w-full border border-neutral-700 bg-neutral-800 text-white placeholder-neutral-600 p-3.5 rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Назва пісні</label>
                <input 
                  {...register('songTitle', { required: true })} 
                  placeholder="Думи мої..." 
                  className="w-full border border-neutral-700 bg-neutral-800 text-white placeholder-neutral-600 p-3.5 rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Жанр</label>
                <input 
                  {...register('performanceGenre', { required: true })} 
                  placeholder="Етно / Поп" 
                  className="w-full border border-neutral-700 bg-neutral-800 text-white placeholder-neutral-600 p-3.5 rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                  Країна
                </label>
                <CountrySelect 
                name="country"
                value={selectedCountry|| ''}
                onChange={(val)=>setValue('country',val,{shouldValidate:true,shouldDirty:true})}></CountrySelect>
              </div>
            </div>

          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-sm font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400 uppercase tracking-widest mb-5">
            2. Технічний райдер
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-neutral-800/50 p-6 rounded-2xl border border-neutral-800">
       
            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Локація (Сцена)</label>
              <select 
                {...register('venueName', { required: true })} 
                className="w-full border border-neutral-700 bg-neutral-800 text-white p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all cursor-pointer"
              >
                <option value="Головна сцена">Головна сцена (до 500 місць)</option>
                <option value="Малий зал">Малий зал (до 150 місць)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Обладнання</label>
              <div className="space-y-3">
                {['Радіомікрофон', 'Стійка для мікрофона', 'Проєктор', 'Монітори'].map((item) => (
                  <label key={item} className="flex items-center gap-3 text-sm text-neutral-300 cursor-pointer hover:text-white transition-colors">
                    <input 
                      type="checkbox" 
                      value={item} 
                      {...register('equipment')} 
                      className="w-5 h-5 accent-pink-500 cursor-pointer" 
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Реквізит</label>
              <div className="space-y-3">
                {['Стілець', 'Стіл', 'Фортепіано', 'Ширма'].map((item) => (
                  <label key={item} className="flex items-center gap-3 text-sm text-neutral-300 cursor-pointer hover:text-white transition-colors">
                    <input 
                      type="checkbox" 
                      value={item} 
                      {...register('props')} 
                      className="w-5 h-5 accent-blue-500 cursor-pointer" 
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="flex gap-4 justify-end pt-4 border-t border-neutral-800">
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-6 py-3 font-bold text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors"
          >
            Скасувати
          </button>
          <button 
            type="submit" 
            className="bg-linear-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-8 py-3 rounded-full font-extrabold shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_25px_rgba(236,72,153,0.5)] transition-all active:scale-95"
          >
            Зберегти в базу
          </button>
        </div>
      </form>
    </div>
  );
}