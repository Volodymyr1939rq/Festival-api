"use client"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
interface EvaluateForm{
  score1:number,
  score2:number,
  score3:number,
  tour:string
}
interface EvaluateModalProps{
    participant:any,
    onClose:()=>void,
    onSubmit:(data:any)=>void,
    serverError?:string | null;
}

export function EvaluateModal({participant,onClose,onSubmit,serverError}:EvaluateModalProps){

  const {register,handleSubmit,watch,formState:{errors},reset}=useForm<EvaluateForm>({
    defaultValues:{
      score1:0,
      score2:0,
      score3:0
    }
  })

  const s1=Number(watch('score1')) || 0
  const s2=Number(watch('score2')) || 0
  const s3=Number(watch('score3')) || 0
  const totalScore=s1+s2+s3
  const isError=totalScore>100 || s1>40 || s2>30 || s3>30

  useEffect(()=>{
   if(participant) 
    reset({score1:0,score2:0,score3:0})
  },[participant,reset])

    if(!participant)return null

    const handleFormSubmit=(data:EvaluateForm)=>{
      const val1=data.score1 ? Number(data.score1) : 0
      const val2=data.score2 ? Number(data.score2) : 0
      const val3=data.score3 ? Number(data.score3) : 0
      const currentTour=Number(data.tour)
      const payload=[
        {name:'Техніка виконання',maxScore:40,receivedScore:val1,tourNumber:currentTour},
        {name:'Артистизм',maxScore:30,receivedScore:val2,tourNumber:currentTour},
        {name:'Сценічний образ',maxScore:30,receivedScore:val3,tourNumber:currentTour}
      ];
      onSubmit({tour:data.tour,criterion:payload})
    }
    return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Оцінювання виступу</h1>
        <p className="text-slate-500 mb-6 pb-4 border-b border-slate-100">
          Учасник: <strong className="text-indigo-600">{participant.firstName} {participant.lastName}</strong>
        </p>
        
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-600 mb-2">Оберіть тур</label>
            <select 
              {...register('tour', { required: true })} 
              className="w-full border border-slate-300 bg-slate-50 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
            >
              <option value="1">Тур 1</option>
              <option value="2">Тур 2</option>
              <option value="3">Тур 3</option>
            </select>
          </div>
          
          <div className="space-y-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
        
            <div className="flex justify-between items-center gap-4">
              <label className="text-sm font-semibold text-slate-700 w-1/2">Техніка виконання <span className="text-xs text-slate-400 block font-normal">(макс. 40)</span></label>
              <input type='number' min='0' max='40' {...register('score1', { required: true, max: 40, min: 0,valueAsNumber:true})} 
                className={`w-24 p-2 rounded-lg outline-none text-center font-bold border focus:ring-2 ${s1 > 40 ? "border-rose-500 text-rose-600 focus:ring-rose-500" : "border-slate-300 focus:ring-indigo-500"}`} />
            </div>

            <div className="flex justify-between items-center gap-4">
              <label className="text-sm font-semibold text-slate-700 w-1/2">Артистизм <span className="text-xs text-slate-400 block font-normal">(макс. 30)</span></label>
              <input type='number' min='0' max='30' {...register('score2', { required: true, max: 30, min: 0,valueAsNumber:true })} 
                className={`w-24 p-2 rounded-lg outline-none text-center font-bold border focus:ring-2 ${s2 > 30 ? "border-rose-500 text-rose-600 focus:ring-rose-500" : "border-slate-300 focus:ring-indigo-500"}`} />
            </div>

            <div className="flex justify-between items-center gap-4">
              <label className="text-sm font-semibold text-slate-700 w-1/2">Сценічний образ <span className="text-xs text-slate-400 block font-normal">(макс. 30)</span></label>
              <input type='number' min='0' max='30' {...register('score3', { required: true, max: 30, min: 0,valueAsNumber:true})} 
                className={`w-24 p-2 rounded-lg outline-none text-center font-bold border focus:ring-2 ${s3 > 30 ? "border-rose-500 text-rose-600 focus:ring-rose-500" : "border-slate-300 focus:ring-indigo-500"}`} />
            </div>
          </div>

          <div className={`flex justify-between items-center mb-6 p-3 rounded-xl font-bold ${isError ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'}`}>
            <span>Загальний бал:</span>
            <span className="text-xl">{totalScore} / 100</span>
          </div>
          
          {serverError && (
            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2">
              <span className="text-rose-500">⚠️</span>
              <p className="text-rose-700 text-sm font-medium">{serverError}</p>
            </div>
          )}
          
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-5 py-2.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
              Скасувати
            </button>
            <button type="submit" disabled={isError} className={`px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors ${isError ? "bg-slate-300 text-slate-500 cursor-not-allowed" : "text-white bg-indigo-600 hover:bg-indigo-700"}`}>
              Зберегти оцінку
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}