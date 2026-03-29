import { useForm } from "react-hook-form";

export interface ParticipantFormData {
  firstName: string;
  lastName: string;
  groupName: string;
  performanceGenre: string;
  venueName:string;
  equipment:string[];
  props:string[];

}
interface AddParticipationProps{
    onCancel:()=>void,
    onSubmit:(data:any)=>void
}
export default function AddParticipationsForm({onSubmit,onCancel}:AddParticipationProps){
  const {register,handleSubmit,formState:{errors}}=useForm<ParticipantFormData>()

  const handleFormSubmit=(data:ParticipantFormData)=>{
      const payload={
        firstName:data.firstName,
        lastName:data.lastName,
        groupName:data.groupName,
        performanceGenre:data.performanceGenre,
        venue:{
          name:data.venueName,
          capacity:data.venueName==="Головна сцена" ? 500 :150
        },
        equipments:data.equipment ? data.equipment.map(eq=>({name:eq,quantity:1})):[],
        proplist:data.props ? data.props.map((p,index)=>({title:p,propNumber:index+1})):[]
      }
      onSubmit(payload)
  }
 return (
     <div className="bg-white p-8 rounded-2xl border border-slate-100 mb-8 shadow-xl shadow-blue-900/5 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-700">Нова реєстрація учасника</h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
          Закрити
        </button>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="mb-8">
          <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4">1. Основні дані</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Ім'я</label>
              <input {...register('firstName', { required: true })} placeholder="Тарас" className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Прізвище</label>
              <input {...register('lastName', { required: true })} placeholder="Шевченко" className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Група</label>
              <input {...register('groupName', { required: true })} placeholder="ІПСА" className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Жанр</label>
              <input {...register('performanceGenre', { required: true })} placeholder="Поезія" className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" />
            </div>
          </div>
        </div>

        <hr className="border-slate-100 mb-8" />

        <div className="mb-8">
          <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4">2. Технічний райдер</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
       
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Локація (Сцена)</label>
              <select {...register('venueName', { required: true })} className="w-full border border-slate-200 bg-white p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                <option value="Головна сцена">Головна сцена (до 500 місць)</option>
                <option value="Малий зал">Малий зал (до 150 місць)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Обладнання</label>
              <div className="space-y-2">
                {['Радіомікрофон', 'Стійка для мікрофона', 'Проєктор', 'Монітори'].map((item) => (
                  <label key={item} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-indigo-600">
                    <input type="checkbox" value={item} {...register('equipment')} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                    {item}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Реквізит</label>
              <div className="space-y-2">
                {['Стілець', 'Стіл', 'Фортепіано', 'Ширма'].map((item) => (
                  <label key={item} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-indigo-600">
                    <input type="checkbox" value={item} {...register('props')} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                    {item}
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onCancel} className="px-6 py-3 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            Скасувати
          </button>
          <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-semibold shadow-md transition-all">
            Зберегти в базу
          </button>
        </div>
      </form>
    </div>
  );
}