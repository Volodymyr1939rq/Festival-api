interface DeleteModalProps{
    participants:any,
    onClose:()=>void,
    onComfirm:(id:string)=>void
}

export default function DeleteModal({participants,onClose,onComfirm}:DeleteModalProps){
  if(!participants) return null

return(
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all ">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200 border border-slate-100 text-center relative">
            <h2 className="text-xl font-bold text-slate-800 mb-3">Видалити учасника {participants.firstName} {participants.lastName}?</h2>
            <div className="flex items-center gap-3">
                <button onClick={onClose} className="flex-1 px-5 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                    Скасувати
                </button>
                <button onClick={()=>onComfirm(participants.id)} className="flex-1 px-5 py-3 rounded-xl font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-200 transition-all transform hover:-translate-y-0.5">
                    Видалити
                </button>
            </div>
        </div>
    </div>
)
}