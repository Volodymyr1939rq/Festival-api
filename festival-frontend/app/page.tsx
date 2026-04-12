"use client"

import { Download, Plus, Trash2, Music, Heart, Star, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import DeleteModal from "./components/DeleteModal";
import { EvaluateModal } from "./components/EvaluateModal";
import EditModal from "./components/EditModal";
import AddParticipationsForm from "./components/AddParticipantsForm";
import { useParticipants } from "./hooks/useParticipant";
import { EurovisionTabs } from "./components/EuroVisionTabs";
import { TourList } from "./components/TourList";
import { CountryBadge } from "./components/CountryBadge";

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  songTitle: string;
  performanceGenre: string;
  tour1Score: number;
  tour2Score: number;
  tour3Score: number;
  photoBase64?:string;
  allocatedSemiFinal:number;
  prize?: { title: string; description: string } | null;
  venue?: { name: string } | null;
  country?:string;
}

export default function Home() {
  const [showform, setShowForm] = useState(false);
  const [evaluetingParticipant, setEvaluetingParticipant] = useState<Participant | null>(null);
  const [updateParticipant, setUpdateParticipant] = useState<Participant | null>(null);
  const [deleteParticipant, setDeleteParticipant] = useState<Participant | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [saveFinalist,setSaveFinalist]=useState<Participant[]>([])
  const [activeTab, setActiveTab] = useState("all");
  
  const {
    participants,
    loader,
    addParticipant,
    updateParticipant: updateDataOnServer,
    evaluateParticipant,
    deleteParticipant: deleteDataOnServer,
    conductAllocationDraw,
    getGrandFinalist
  } = useParticipants();

  const handleSubmit = async (data: any) => {
    const newParticipant = {
      ...data,
      tour1Score: 0,
      tour2Score: 0,
      tour3Score: 0
    };
    const success = await addParticipant(newParticipant);
    if (success) setShowForm(false);
  }

 const handleEvaluate = async (data: any) => {
    if (!evaluetingParticipant) return null;
    setEvalError(null);
    const result=await evaluateParticipant(data)

    if(result && result.success){
      setEvaluetingParticipant(null)
    } else if(result && result.error){
      setEvalError(result.error)
    }
  }

  const handleUpdate = async (data: any) => {
    if (!updateParticipant) return null;
    const updatedData = {
      ...data,
      tour1Score: updateParticipant.tour1Score,
      tour2Score: updateParticipant.tour2Score,
      tour3Score: updateParticipant.tour3Score,
    };
    const success = await updateDataOnServer(updateParticipant.id, updatedData);
    if (success) setUpdateParticipant(null);
  }

  const handleDelete = async (id: string) => {
    const success = await deleteDataOnServer(id);
    if (success) setDeleteParticipant(null);
  }

  const handleDraw=async ()=>{
   await conductAllocationDraw()
  }

  useEffect(()=>{
    const fetchGrandFinalist=async()=>{
      if(activeTab==='final'){
        const data=await getGrandFinalist()
        if(data){
          setSaveFinalist(data)
        }
      }
    }
    fetchGrandFinalist()
  },[activeTab,participants])

  const semiFinal1 = participants.filter(p=>Number(p.allocatedSemiFinal)===1);
  const semiFinal2 = participants.filter(p=>Number(p.allocatedSemiFinal)===2);
  const needDraw=participants.length>0 && participants.some(s=>!s.allocatedSemiFinal)
  let displayedParticipants = participants;
  if (activeTab === "sf1") displayedParticipants = semiFinal1;
  else if (activeTab === "sf2") displayedParticipants = semiFinal2;


  if (loader) return <div className="p-10 text-xl font-bold text-slate-500 bg-neutral-950 min-h-screen">Завантаження даних фестивалю...</div>;

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans relative pt-16 pb-20">
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      
      <div className="max-w-7xl mx-auto p-6 md:p-10 relative z-10">
        {participants.length > 0 && (
          <EurovisionTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 border-b border-neutral-800/50 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 tracking-tight mb-2">
              Конкурсанти Фестивалю
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {activeTab==='all' && (
            <button 
                onClick={() => window.location.href="http://localhost:8080/api/participants/export/excel"}
                className="flex items-center justify-center w-12 h-12 rounded-full transition-all text-neutral-400 bg-neutral-900 hover:bg-green-900/30 hover:text-green-400 border border-neutral-800 shadow-sm"
                title="Експорт в Excel"
              >
                <Download className="w-5 h-5" strokeWidth={2.5}/>
            </button>
            )}
              {activeTab==='all' && (
            <button
              onClick={() => setShowForm(!showform)}
              className={`flex items-center justify-center bg-linear-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-extrabold rounded-full shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all hover:scale-105 active:scale-95 ${
              showform ? "px-6 h-12" : "px-6 h-12 gap-2"
              }`}
            >  
              {showform ? "Скасувати" : <><Plus size={20} strokeWidth={3} /> Додати учасника</>}
            </button>
              )}
          </div>
          {needDraw && activeTab==='all' && (
          <button 
                onClick={handleDraw}
                className="flex items-center justify-center h-12 px-6 rounded-full transition-all duration-300 text-white bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 font-extrabold shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] hover:scale-105 active:scale-95"
                title="Випадково розподілити учасників по півфіналах"
              >
                <span className="mr-2 text-xl">🎲</span> Жеребкування
            </button>
          )}
        </div>

        {participants.length === 0 ? (
          <div className="text-center bg-neutral-900/50 p-16 rounded-4xl border border-neutral-800 border-dashed shadow-sm">
            <h3 className="text-xl font-bold text-neutral-300 mb-2">Список порожній</h3>
            <p className="text-neutral-500">Додайте першого учасника, щоб розпочати фестиваль.</p>
          </div>
        ) : (
          <div className="w-full relative z-10">
            
            {activeTab === "all" && (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
  {participants.map(p => (
    <div 
      key={p.id} 
      className="relative group rounded-4xl overflow-hidden aspect-2/3 shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-[#050505]"
    >
   
      <div className="absolute inset-0 z-0">
        <img 
          src={p.photoBase64 || "https://images.unsplash.com/photo-1516280440502-8610731fa382?q=80&w=600&auto=format&fit=crop"} 
          alt={`${p.firstName} ${p.lastName}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
      </div>

      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-40 transform translate-x-2 group-hover:translate-x-0">
        <button onClick={() => setUpdateParticipant(p)} className="p-3 bg-white/10 hover:bg-blue-500 backdrop-blur-md rounded-full text-white transition-all">
          <Pencil size={18} />
        </button>
        <button onClick={() => setDeleteParticipant(p)} className="p-3 bg-white/10 hover:bg-red-500 backdrop-blur-md rounded-full text-white transition-all">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 flex flex-col items-center z-30 pointer-events-none">
        
        <h2 className="text-3xl md:text-4xl font-black text-white text-center uppercase tracking-tighter mb-4 drop-shadow-2xl">
          {p.firstName}
        </h2>

       <div className="flex items-center justify-center gap-6 w-full mb-4"> 

  <div className="flex items-center gap-2 bg-[#1a1525] text-white px-4 py-2 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.3)] border border-white/5 cursor-default hover:bg-[#231d33] transition-colors z-0">
    <Music size={14} className="text-white/70" />
    <span className="font-bold text-xs uppercase tracking-wider truncate max-w-24">
      {p.songTitle}
    </span>
  </div>

{p.country && (
<CountryBadge country={p.country}/>
  
)}

</div>
      </div>

    </div>
  ))}
</div>
            )}

            {activeTab === "sf1" && (
              <TourList 
                title="Перший півфінал" 
                highlightedWord="running order" 
                participants={semiFinal1} 
                currentTour={1}
                onRateClick={setEvaluetingParticipant} 
              />
            )}
          
            {activeTab === "sf2" && (
              <TourList 
                title="Другий півфінал" 
                highlightedWord="running order" 
                participants={semiFinal2} 
                currentTour={2}
                onRateClick={setEvaluetingParticipant} 
              />
            )}
            
            {activeTab === "final" && (
              <TourList 
                title="Фінал" 
                highlightedWord="running order" 
                participants={saveFinalist} 
                currentTour={3}
                onRateClick={setEvaluetingParticipant} 
              />
            )}

          </div>
        )}
       </div>

      <DeleteModal 
        participants={deleteParticipant}
        onClose={() => setDeleteParticipant(null)}
        onComfirm={() => deleteParticipant && handleDelete(deleteParticipant.id)}
      />
      
      <EvaluateModal 
        participant={evaluetingParticipant}
        onClose={() => setEvaluetingParticipant(null)}
        onSubmit={handleEvaluate}
        serverError={evalError}
      />
      
      <EditModal 
        participant={updateParticipant}
        onClose={() => setUpdateParticipant(null)}
        onSubmit={handleUpdate}
      />

     {showform && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl my-auto animate-in fade-in zoom-in duration-300">
             <AddParticipationsForm onCancel={() => setShowForm(false)} onSubmit={handleSubmit} />
          </div>
        </div>
      )}
    </main>
  );
}