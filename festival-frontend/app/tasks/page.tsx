"use client"

import { useState } from "react";
import { TaskStatus, useTasks } from "../hooks/useTask"
import { useForm } from "react-hook-form";
import { Briefcase, CheckCircle2, FileText, LayoutList, Plus, UserPlus, Users, X } from "lucide-react";
import DropDowmMenu from "../components/DropDownMenu";
import AssigneeDropDown from "../components/AssigneeDropDown";

interface TaskForm{
  title:string,
  description:string
}
interface HostForm{
  fullname:string,
  role:string
}

export default function TaskBoard(){
   const {host,task,loader,addHost,addTask,updateTaskStatus,assignHost} = useTasks();

   const [showHostModal,setShowHostModal]=useState(false)
   const [showTaskModal,setShowTaskModal]=useState(false)

   const {
    register:registerHost,
    handleSubmit:handleSubmitHost,
    reset:resetHost,
    watch:watchHost,
    setValue:setHostValue,
   } = useForm<HostForm>();

   const {
    register:registerTask,
    handleSubmit:handleSubmitTask,
    reset:resetTask
   } = useForm<TaskForm>();

   if (loader) return <div className="p-10 text-xl font-bold text-slate-500 bg-neutral-950 min-h-screen">Завантаження бекстейджу...</div>;

   const handleDragStart=(e:React.DragEvent,taskId:string)=>{
       e.dataTransfer.setData('taskId',taskId)
   }

   const handleDragOver=(e:React.DragEvent)=>{
    e.preventDefault()
   }

   const handleDrop=(e:React.DragEvent,newStatus:TaskStatus)=>{
    e.preventDefault()
    const taskId=e.dataTransfer.getData('taskId')
    if(taskId){
        updateTaskStatus(taskId,newStatus)
    }
   }

   const onTaskSubmit=async (data:TaskForm)=>{
    const success=await addTask({title:data.title,description:data.description,tourNumber:1})
    if(success){
        setShowTaskModal(false)
        resetTask();
    }
   }
   
   const onHostSubmit=async(data:HostForm)=>{
    const success=await addHost({fullName:data.fullname,role:data.role,})
    if(success){
        setShowHostModal(false)
        resetHost()
    }
   }
   
   const todoTask=task.filter(t=>t.status===TaskStatus.TODO)
   const inProgress=task.filter(t=>t.status===TaskStatus.IN_PROGRESS)
   const doneTask=task.filter(t=>t.status===TaskStatus.DONE)

  // Компонент колонки (Темна тема)
  const Column = ({ title, status, columnTasks }: { title: string, status: TaskStatus, columnTasks: any[] }) => (
    <div 
      className="flex flex-col bg-[#111322]/40 rounded-4xl p-5 min-h-[70vh] w-full border border-white/5 shadow-2xl backdrop-blur-md"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, status)}
    >
      <div className="flex items-center justify-between mb-6 px-2 border-b border-white/5 pb-4">
        <h3 className="font-black text-white text-sm uppercase tracking-widest flex items-center gap-3">
          {title} 
          <span className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            {columnTasks.length}
          </span>
        </h3>
      </div>
      
      <div className="flex flex-col gap-4 relative h-full">
        {columnTasks.map(task => (
          <div 
            key={task.id} 
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
            className="group bg-[#1a1d2d] p-5 rounded-2xl shadow-lg border border-white/5 cursor-grab active:cursor-grabbing hover:border-indigo-500/50 hover:shadow-[0_10px_30px_rgba(79,70,229,0.2)] hover:-translate-y-1 transition-all flex flex-col"
          >
            <h4 className="text-sm font-black text-white leading-snug mb-2 uppercase tracking-wide">{task.title}</h4>
            <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed mb-4">{task.description}</p>
            
            <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
             <AssigneeDropDown 
                value={task.assignedHostId || null}
                hosts={host}
                onChange={(hostId)=>assignHost(task.id,hostId)}
             />
            </div>
          </div>
        ))}
        <div className="absolute inset-0 z-[-1]"></div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans relative pt-24 pb-20">
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto p-6 md:p-10 relative z-10"> 
   
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-neutral-800/50 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 tracking-tight mb-2">
              Кулуарний менеджмент
            </h1>
            <p className="text-neutral-400 font-medium">Керування завданнями, реквізитом та командою фестивалю</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowHostModal(true)} 
              className="flex items-center justify-center w-12 h-12 rounded-full transition-all text-neutral-300 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 backdrop-blur-md shadow-lg"
              title="Команда (Ведучі, Реквізитори)"
            >
              <Users className="w-5 h-5" strokeWidth={2.5} />
            </button>
            
            <button 
              onClick={() => setShowTaskModal(true)} 
              className="flex items-center justify-center bg-linear-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-6 py-3 rounded-full font-extrabold shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all hover:scale-105 active:scale-95 gap-2"
              title="Нове завдання"
            >
              <Plus className="w-5 h-5" strokeWidth={3} /> Додати задачу
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <Column title="Треба зробити" status={TaskStatus.TODO} columnTasks={todoTask} />
          <Column title="В процесі" status={TaskStatus.IN_PROGRESS} columnTasks={inProgress} />
          <Column title="Виконано" status={TaskStatus.DONE} columnTasks={doneTask} />
        </div>

      </div>

      {showTaskModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-100 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] rounded-4xl border border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-lg overflow-hidden flex flex-col relative">
            
            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-blue-600 via-purple-500 to-pink-500"></div>
            
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3 text-white">
                <LayoutList size={22} className="text-pink-500" />
                <h2 className="text-xl font-black uppercase tracking-wide">Створити завдання</h2>
              </div>
              <button onClick={() => { setShowTaskModal(false); resetTask(); }} className="text-neutral-500 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitTask(onTaskSubmit)} className="flex flex-col">
              <div className="p-8 flex flex-col gap-6">
                <div>
                  <label className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-indigo-500"/> Короткий підсумок
                  </label>
                  <input 
                    {...registerTask('title', { required: true })} 
                    placeholder="Наприклад: Налаштувати світло"
                    className="w-full p-4 bg-neutral-900 border border-neutral-700 rounded-2xl outline-none focus:bg-neutral-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all text-sm text-white placeholder:text-neutral-600 font-medium" 
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FileText size={14} className="text-indigo-500"/> Детальний опис
                  </label>
                  <textarea 
                    {...registerTask('description', { required: true })} 
                    placeholder="Вкажіть техніку, приміщення або реквізит..."
                    className="w-full p-4 bg-neutral-900 border border-neutral-700 rounded-2xl outline-none focus:bg-neutral-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all text-sm text-white placeholder:text-neutral-600 resize-none h-32 font-medium" 
                  />
                </div>
              </div>

              <div className="px-8 py-5 bg-black/40 border-t border-white/5 flex justify-end gap-3">
                <button type="button" onClick={() => { setShowTaskModal(false); resetTask(); }} className="px-6 py-3 text-sm font-bold text-neutral-400 bg-transparent hover:text-white rounded-full transition-colors">
                  Скасувати
                </button>
                <button type="submit" className="px-8 py-3 text-sm font-black text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2 uppercase tracking-wide">
                  Зберегти
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showHostModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-100 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] rounded-4xl border border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-md flex flex-col relative overflow-visible">
            
            <div className="absolute top-0 left-0 w-full h-1.5 bg-lenear-to-r from-green-500 to-emerald-500"></div>

            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3 text-white">
                <UserPlus size={22} className="text-emerald-500" />
                <h2 className="text-xl font-black uppercase tracking-wide">Новий учасник</h2>
              </div>
              <button onClick={() => { setShowHostModal(false); resetHost(); }} className="text-neutral-500 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitHost(onHostSubmit)} className="flex flex-col">
              <div className="p-8 flex flex-col gap-6">
                <div>
                  <label className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FileText size={14} className="text-emerald-500"/> Ім'я та Прізвище
                  </label>
                  <input 
                    {...registerHost('fullname', { required: true })} 
                    placeholder="Наприклад: Тімур Мірошниченко"
                    className="w-full p-4 bg-neutral-900 border border-neutral-700 rounded-2xl outline-none focus:bg-neutral-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm text-white placeholder:text-neutral-600 font-medium" 
                  />
                </div>
               <div>
                 <label className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Briefcase size={14} className="text-emerald-500"/> Роль на фестивалі
                 </label>
                 <input type="hidden" {...registerHost('role',{required:true})}/>
       
                 <div className="bg-neutral-900 border border-neutral-700 rounded-2xl focus-within:ring-2 focus-within:ring-emerald-500/50 relative z-50">
                    <DropDowmMenu 
                      value={watchHost('role')}
                      onChange={(val)=>setHostValue('role',val,{shouldValidate:true})}
                    />
                 </div>
               </div>
              </div>

              <div className="px-8 py-5 bg-black/40 border-t border-white/5 flex justify-end gap-3 rounded-b-4xl">
                <button type="button" onClick={() => { setShowHostModal(false); resetHost(); }} className="px-6 py-3 text-sm font-bold text-neutral-400 bg-transparent hover:text-white rounded-full transition-colors">
                  Скасувати
                </button>
                <button type="submit" className="px-8 py-3 text-sm font-black text-white bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2 uppercase tracking-wide">
                  Додати <UserPlus size={16}/>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}