"use client"

import {useState } from "react"
import { useForm } from "react-hook-form"
import { useApi } from "../hooks/useApi"
import { ArrowLeft, Trash2, AlertCircle } from "lucide-react"
import DeleteModal from "../components/DeleteModal"

interface JuryMember{
    id:string
    fullName:string
    qualification:string
}

interface JuryFormData{
    fullName:string
    qualification:string
}

export default function JuryPage(){
  
    const [showForm,setShowForm]=useState(false)
    const [deleteJury,setDeleteJury]=useState<JuryMember | null>(null)
    const [error,setError]=useState<string| null>(null)
    const {
        data:juryList,
        loading,
        addItem,
        handleDelete
    }=useApi<JuryMember>('http://localhost:8080/api/jury')
    
    const {register,handleSubmit,reset,formState:{errors}}=useForm<JuryFormData>()

    const onSubmit=async(data:JuryFormData)=>{
      setError(null)
        const success=await addItem(data)
        if(success){
            reset()
            setShowForm(false)
        }else{
          setError('Кількість журі не може бути більше 7')
        }
    }
    const onConfirmDelete=async()=>{
        if(!deleteJury){
            return
        }
        const success=await handleDelete(deleteJury.id)
        if(success){
            setDeleteJury(null)
        }
    }
    
    if(loading) return <div className="p-10 text-center font-bold text-blue-600 animate-pulse">Завантаження суддів...</div>
    
    return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        <a href="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold mb-6 transition-colors">
          <ArrowLeft size={20} /> Повернутися до учасників
        </a>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
              Склад Журі
            </h1>
            <p className="text-slate-500 mt-1">Керування суддями фестивалю</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
            }}
            className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            {showForm ? "Скасувати" : "+ Додати суддю"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 mb-8 shadow-xl shadow-slate-200/40 animate-in fade-in slide-in-from-top-4 duration-300">
            <h2 className="text-xl font-bold mb-6 text-slate-700">Новий член журі</h2>
            
            <form onSubmit={handleSubmit(onSubmit)}>
                 {error && (
                  <div className="mb-5 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-3 text-sm font-semibold shadow-sm animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={20} className="text-rose-500 shrink-0" />
                  <span>{error}</span>
                  </div>
                 )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">ПІБ</label>
                  <input 
                    {...register("fullName", { required: true })} 
                    placeholder="Напр. Тіна Кароль" 
                    className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" 
                  />
                  {errors.fullName && <span className="text-xs text-rose-500 mt-1 block">Це поле є обов'язковим</span>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Кваліфікація</label>
                  <input 
                    {...register("qualification", { required: true })} 
                    placeholder="Вокал" 
                    className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" 
                  />
                  {errors.qualification && <span className="text-xs text-rose-500 mt-1 block">Це поле є обов'язковим</span>}
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:bg-slate-800 transition-all">
                  Зберегти
                </button>
              </div>
            </form>

          </div>
        )}

        {juryList.length === 0 ? (
          <div className="text-center bg-white p-16 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-2">Список суддів порожній</h3>
            <p className="text-slate-500">Додайте членів журі (від 3 до 7 осіб), щоб мати можливість оцінювати учасників.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="py-5 px-6 text-xs font-bold text-slate-300 uppercase tracking-widest first:rounded-tl-3xl">№</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-300 uppercase tracking-widest">Суддя</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-300 uppercase tracking-widest">Кваліфікація</th>
                    <th className="py-5 px-6 text-right text-xs font-bold text-slate-300 uppercase tracking-widest last:rounded-tr-3xl">Дії</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {juryList.map((j,index) => (
                    <tr key={j.id} className="bg-slate-100 even:bg-slate-200 hover:bg-slate-300 transition-colors group">
                      <td className="py-4 px-6 font-bold text-slate-400">
                        {index+1}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shadow-inner shrink-0">
                            {j.fullName?.charAt(0) || "?"}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{j.fullName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                          {j.qualification}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center actions-td">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setDeleteJury(j)} 
                            className="bg-red-50 hover:bg-red-100 text-rose-800 p-2 rounded-lg transition-colors shadow-sm flex items-center justify-center border border-red-100"
                            title="Видалити"
                          >
                            <Trash2 size={18} strokeWidth={1.5} />
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

      <DeleteModal 
        participants={deleteJury} 
        onClose={()=>setDeleteJury(null)}
        onComfirm={onConfirmDelete}
      />
    </main>
    )
}