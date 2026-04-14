"use client"

import { useState } from "react"
import { useApi } from "../hooks/useApi"
import { ArrowLeft, Trash2, Star, User } from "lucide-react"
import DeleteModal from "../components/DeleteModal"
import AddJuryForm from "../components/AddJuryForm" 
import { JuryMember } from "../types"


export default function JuryPage() {
  const [showForm, setShowForm] = useState(false)
  const [deleteJury, setDeleteJury] = useState<JuryMember | null>(null)
  
  const {
    data: juryList,
    loading,
    addItem,
    handleDelete
  } = useApi<JuryMember>(process.env.NEXT_PUBLIC_API_URL + '/api/jury')

  const onConfirmDelete = async () => {
    if (!deleteJury) return
    const success = await handleDelete(deleteJury.id)
    if (success) {
      setDeleteJury(null)
    }
  }

  if (loading) return <div className="p-10 text-xl font-bold text-slate-500 bg-neutral-950 min-h-screen">Завантаження суддів...</div>

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans relative pt-24 pb-20">
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto p-6 md:p-10 relative z-10">
        
        <div className="mb-8">
          <a href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-pink-400 font-semibold text-sm transition-all bg-neutral-900/60 hover:bg-neutral-800 px-5 py-2.5 rounded-full border border-neutral-800 hover:border-pink-500/30 w-fit backdrop-blur-md shadow-sm">
            <ArrowLeft size={16} /> Повернутися до учасників
          </a>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-neutral-800/50 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 tracking-tight mb-2">
              Національне Журі
            </h1>
          </div>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center bg-linear-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-8 py-3 rounded-full font-extrabold shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all hover:scale-105 active:scale-95"
          >
            {showForm ? "Скасувати" : "+ Додати суддю"}
          </button>
        </div>

        {showForm && (
          <AddJuryForm 
            addItem={addItem} 
            onSuccess={() => setShowForm(false)} 
          />
        )}

        {juryList.length === 0 ? (
          <div className="text-center bg-neutral-900/50 p-16 rounded-4xl border border-neutral-800 border-dashed shadow-sm mt-8">
            <h3 className="text-xl font-bold text-neutral-300 mb-2">Журі ще не сформовано</h3>
            <p className="text-neutral-500">Додайте експертів (від 3 до 7 осіб) для початку оцінювання.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 mt-10 animate-in fade-in duration-700">
            {juryList.map((j) => (
              <div 
                key={j.id} 
                className="relative group rounded-4xl overflow-hidden aspect-2/3 shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-[#050505]"
              >
                <div className="absolute inset-0 z-0 bg-[#0a0a0a]/20">
                  {j.photoBase64 ? (
                    <img 
                      src={j.photoBase64} 
                      alt={`${j.fullName}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full  flex items-center justify-center overflow-hidden">
                      <User 
                        size={400} 
                        strokeWidth={0.5} 
                        className="text-neutral-700 transition-transform duration-700 group-hover:scale-105 translate-y-12" 
                      />
                    </div>
                  )}
                </div>
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-40 transform translate-x-2 group-hover:translate-x-0">
                    <button 
                      onClick={() => setDeleteJury(j)} 
                      className="p-3 bg-white/10 hover:bg-red-600 text-white transition-all backdrop-blur-md rounded-full shadow-lg"
                    >
                      <Trash2 size={18} strokeWidth={2.5} />
                    </button>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 flex flex-col items-center z-30 pointer-events-none">
                  <h2 className="text-3xl md:text-4xl font-black text-white text-center uppercase tracking-tighter mb-4 drop-shadow-2xl">
                    {j.fullName}
                  </h2>

                  <div className="flex items-center justify-center gap-2 w-full">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/80 backdrop-blur-lg rounded-full border border-white/10 shrink-0 max-w-[55%]">
                      <Star size={12} fill="currentColor" className="text-yellow-500 shrink-0" />
                      <span className="text-[11px] font-bold text-white uppercase tracking-wider truncate">
                        {j.qualification}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-xl shrink-0">
                      <User size={12} className="text-blue-600 shrink-0" />
                      <span className="text-[11px] font-black text-black uppercase tracking-wider">
                        Official Jury
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteModal 
        participants={deleteJury} 
        onClose={() => setDeleteJury(null)}
        onComfirm={onConfirmDelete}
      />
    </main>
  )
}