import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
interface EditFormData{
  firstName:string,
  lastName:string,
  groupName:string,
  performanceGenre:string,
  venueName:string,
  equipment:string[],
  props:string[],
}

interface EditModalProps{
    participant:any,
    onClose:()=>void,
    onSubmit:(data:any)=>void
}

export default function EditModal({participant,onClose,onSubmit}:EditModalProps){
  const getInitialValues=()=>{
    if(!participant) return {};
      return {
        firstName:participant.firstName,
        lastName:participant.lastName,
        groupName:participant.groupName,
        performanceGenre:participant.performanceGenre,
        venue:participant.venue?.name || 'Головна сцена',
        equipment:participant.equipments ? participant.equipments.map((eq:any)=>eq.name):[],
        props:participant.proplist ? participant.proplist.map((p:any)=>p.title):[]
      }
  }
  const {register,handleSubmit,formState:{errors},reset}=useForm<EditFormData>({
    defaultValues:getInitialValues()
  })
  useEffect(()=>{
    if(participant) 
      reset(getInitialValues())
  },[participant,reset])
    if(!participant) return null
    console.log("Дані учасника з бекенду:", participant);
    const handleFormSubmit=(data:EditFormData)=>{
      const payload={
        firstName:data.firstName,
        lastName:data.lastName,
        groupName:data.groupName,
        performanceGenre:data.performanceGenre,
        venue:{
          name:data.venueName,
          capacity:data.venueName==="Головна сцена" ? 500 : 150
        },
        equipments:data.equipment ? data.equipment.map(eq=>({name:eq,quantity:1})):[],
        proplist:data.props ? data.props.map((p,index)=>({title:p,propNumber:index+1})):[]
      }
      onSubmit(payload)
    }
    return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all overflow-y-auto">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200 border border-slate-100 my-8">
        
        <div className="flex items-center justify-between text-center mb-6">
          <h2 className="text-2xl font-extrabold text-slate-800">Редагування профілю</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>
        
        <form onSubmit={handleSubmit(handleFormSubmit)}>
        
          <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3">1. Основні дані</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ім'я</label>
              <input {...register('firstName', { required: true })} 
                className="w-full border border-slate-200 bg-slate-50 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Прізвище</label>
              <input {...register('lastName', { required: true })} 
                className="w-full border border-slate-200 bg-slate-50 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Група</label>
              <input {...register('groupName', { required: true })} 
                className="w-full border border-slate-200 bg-slate-50 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Жанр</label>
              <input {...register('performanceGenre', { required: true })} 
                className="w-full border border-slate-200 bg-slate-50 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" />
            </div>
          </div>

          <hr className="border-slate-100 mb-6" />
          <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3">2. Технічний райдер</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-100 mb-8">
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Локація (Сцена)</label>
              <select {...register('venueName', { required: true })} 
                className="w-full border border-slate-200 bg-white p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                <option value="Головна сцена">Головна сцена</option>
                <option value="Малий зал">Малий зал</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Обладнання</label>
              <div className="space-y-1">
                {['Радіомікрофон', 'Стійка для мікрофона', 'Проєктор', 'Монітори'].map((item) => (
                  <label key={item} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-indigo-600">
                    <input type="checkbox" value={item} {...register('equipment')} 
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Реквізит</label>
              <div className="space-y-1">
                {['Стілець', 'Стіл', 'Фортепіано', 'Ширма'].map((item) => (
                  <label key={item} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-indigo-600">
                    <input type="checkbox" value={item} {...register('props')} 
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                    {item}
                  </label>
                ))}
              </div>
            </div>

          </div>

          <div className="flex gap-3 justify-end pt-5 border-t border-slate-100">
            <button type="button" onClick={onClose} 
              className="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
              Скасувати
            </button>
            <button type="submit" 
              className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md shadow-indigo-200 transition-all transform hover:-translate-y-0.5">
              Зберегти зміни
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}