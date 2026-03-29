"use client"

import { Download, Plus, Trash2 } from "lucide-react";
import {useState } from "react";
import DeleteModal from "./components/DeleteModal";
import { EvaluateModal } from "./components/EvaluateModal";
import EditModal from "./components/EditModal";
import AddParticipationsForm from "./components/AddParticipantsForm";
import { useParticipants } from "./hooks/useParticipant";


interface Participant {
  id:string;
  firstName:string;
  lastName:string;
  groupName:string;
  performanceGenre:string;
  tour1Score:number;
  tour2Score:number;
  tour3Score:number;
}

export default function Home() {
 
  const [showform,setShowForm]=useState(false)
  const [evaluetingParticipant,setEvaluetingParticipant]=useState<Participant | null>(null)
  const [updateParticipant,setUpdateParticipant]=useState<Participant | null>(null)
  const [deleteParticipant,setDeleteParticipant]=useState<Participant | null>(null)
  const [evalError,setEvalError]=useState<string | null>(null);
  const {
    participants,
    loader,
    isJuryReady,
    addParticipant,
    updateParticipant:updateDataOnServer,
    evaluateParticipant,
    deleteParticipant:deleteDataOnServer
  }=useParticipants()

    const handleSubmit=async(data:any)=>{
    
      const newParticipant={
        ...data,
        tour1Score:0,
        tour2Score:0,
        tour3Score:0
      }
      const success=await addParticipant(newParticipant);
      if(success) setShowForm(false)
    }

    const handleEvaluate=async(data:any)=>{
      
      if(!evaluetingParticipant) return null
      setEvalError(null)
      const result=await evaluateParticipant(evaluetingParticipant.id,data.tour,data.criterion)
      if(result && result.success) {
        setEvaluetingParticipant(null)
      } else if(result && result.error){
        setEvalError(result.error);
      }
    }

    const handleUpdate=async(data:any)=>{
      
       if(!updateParticipant) return null
      const updatedData={
        ...data,
        tour1Score:updateParticipant.tour1Score,
        tour2Score:updateParticipant.tour2Score,
        tour3Score:updateParticipant.tour3Score,
      }
        const success=await updateDataOnServer(updateParticipant.id,updatedData)
        if(success) setUpdateParticipant(null)
       }
    
    const handleDelete=async(id:string)=>{
      const success=await deleteDataOnServer(id)
      if(success) setDeleteParticipant(null)
    }

  if(loader) return <div className="p-10 text-xl">Завантаження даних фестивалю</div>
  return (

   <main className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
              Учасники фестивалю
            </h1>
            <p className="text-slate-500 mt-1">Керування базою студентів та їхніми виступами</p>
          </div>
           <div className="flex items-center gap-4">
            <button onClick={()=>window.location.href="http://localhost:8080/api/participants/export/excel"}
              className="flex items-center justify-center w-12 h-12 rounded-full transition-all text-slate-500 bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 active:scale-95 border border-slate-200 shadow-sm">
                <Download className="w-6 h-6" strokeWidth={2}/>
              </button>
                 <button
                onClick={() => setShowForm(!showform)}
                 className={`flex items-center justify-center bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all active:scale-95 ${
                showform ? "px-6 h-12" : "w-12 h-12"
               }`}
             >  
              {showform ? "Скасувати" : <Plus className="w-6 h-6" strokeWidth={2.5} />}
            </button>
           </div>
          {!isJuryReady && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 rounded-r-xl shadow-sm">
            <div className="flex items-center">
              <div className="ml-3">
                <h3 className="text-sm font-bold text-amber-800">⚠️ Оцінювання заблоковано</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Для виставлення балів необхідно сформувати склад журі (від 3 до 7 осіб).
                </p>
                <a href="/jury" className="text-sm font-bold text-amber-600 hover:text-amber-800 underline mt-2 inline-block">
                  Перейти до налаштування журі &rarr;
                </a>
              </div>
            </div>
          </div>
        )}
        </div>

        {showform && (
          <AddParticipationsForm onCancel={()=>setShowForm(false)}
          onSubmit={handleSubmit}/>
        )}

        {participants.length === 0 ? (
          <div className="text-center bg-white p-16 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-2">Список порожній</h3>
            <p className="text-slate-500">Додайте першого учасника, щоб розпочати фестиваль.</p>
          </div>
        ) : (
         <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
  <div className="overflow-x-auto">
    <table className="min-w-full text-left border-collapse">

      <thead className="bg-slate-900 text-white">
        <tr>
          <th className="py-5 px-6 text-xs font-bold text-slate-300 uppercase tracking-widest first:rounded-tl-3xl">№</th>
          <th className="py-5 px-6 text-xs font-bold text-slate-300 uppercase tracking-widest">Учасник</th>
          <th className="py-5 px-6 text-xs font-bold text-slate-300 uppercase tracking-widest">Група</th>
          <th className="py-5 px-6 text-xs font-bold text-slate-300 uppercase tracking-widest">Жанр</th>
          <th className="py-5 px-6 text-center text-xs font-bold text-slate-300 uppercase tracking-widest">Тур 1</th>
          <th className="py-5 px-6 text-center text-xs font-bold text-slate-300 uppercase tracking-widest">Тур 2</th>
          <th className="py-5 px-6 text-center text-xs font-bold text-slate-300 uppercase tracking-widest">Тур 3</th>
          <th className="py-5 px-6 text-center text-xs font-bold text-slate-300 uppercase tracking-widest">Нагороди</th>
          <th className="py-5 px-6 text-center text-xs font-bold text-slate-300 uppercase tracking-widest">Локація</th>
          <th className="py-5 px-6 text-right text-xs font-bold text-slate-300 uppercase tracking-widest last:rounded-tr-3xl">Дії</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100 bg-white">
        {participants.map((p, index) => (
          <tr key={p.id} className="bg-slate-100 even:bg-slate-200 hover:bg-slate-300  transition-colors group">
            <td className="py-4 px-6 font-bold text-slate-400">
              {index + 1}
            </td>
            <td className="py-4 px-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shadow-inner">
                  {p.firstName?.charAt(0) || "?"}{p.lastName?.charAt(0) || ""}
                </div>
                <div>
                  <div className="font-bold text-slate-800">{p.firstName} {p.lastName}</div>
                </div>
              </div>
            </td>
            
            <td className="py-4 px-6">
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                {p.groupName}
              </span>
            </td>
            <td className="py-4 px-6">
              <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                {p.performanceGenre}
              </span>
            </td>

            <td className="py-4 px-6 text-center">
              <span className="font-semibold text-slate-700">{p.tour1Score}</span>
            </td>
            <td className="py-4 px-6 text-center">
              <span className="font-semibold text-slate-700">{p.tour2Score}</span>
            </td>
            <td className="py-4 px-6 text-center">
              <span className="font-semibold text-slate-700">{p.tour3Score}</span>
            </td>
            
            <td className="py-4 px-6 text-center">
              {p.prize ? (
                <span 
                  title={p.prize.description} 
                  className="inline-flex items-center gap-1.5 rounded-md bg-yellow-100 px-2.5 py-1 text-xs font-bold text-yellow-800 ring-1 ring-inset ring-yellow-600/20 shadow-sm cursor-help transition-all hover:bg-yellow-200"
                >
                  🏆 {p.prize.title}
                </span>
              ) : (
                <span className="text-xs font-medium text-slate-300">—</span>
              )}
            </td>
            
            <td className="py-4 px-6 text-center">
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                {p.venue?.name || 'не обрано'}
              </span>
            </td>
            
            <td className="py-4 px-6 text-center actions-td"> 
              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setEvaluetingParticipant(p)}
                  disabled={!isJuryReady}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                    isJuryReady 
                    ? "bg-amber-100 hover:bg-amber-200 text-amber-800" 
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Оцінити
                </button>
                <button 
                  onClick={() => setUpdateParticipant(p)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border border-slate-200"
                >
                  Редагувати
                </button>
                <button 
                  onClick={() => setDeleteParticipant(p)}
                  className="bg-red-50 hover:bg-red-100 text-rose-800 p-2 rounded-lg transition-colors shadow-sm flex items-center justify-center border border-red-100"
                >
                  <Trash2 size={18} strokeWidth={1.5}></Trash2>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
        )}
      </div>
      <DeleteModal participants={deleteParticipant}
      onClose={()=>setDeleteParticipant(null)}
      onComfirm={()=>deleteParticipant && handleDelete(deleteParticipant.id)}/>
      <EvaluateModal participant={evaluetingParticipant}
      onClose={()=>setEvaluetingParticipant(null)}
      onSubmit={handleEvaluate}
      serverError={evalError}/>
      <EditModal participant={updateParticipant}
      onClose={()=>setUpdateParticipant(null)}
      onSubmit={handleUpdate}/>
    </main>
  );
}
