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
   const {host,task,loader,addHost,addTask,updateTaskStatus,assignHost}=useTasks();

   const [showHostModal,setShowHostModal]=useState(false)
   const [showTaskModal,setShowTaskModal]=useState(false)

   const {
    register:registerHost,
    handleSubmit:handleSubmitHost,
    reset:resetHost,
    watch:watchHost,
    setValue:setHostValue,
   }=useForm<HostForm>();

   const {
    register:registerTask,
    handleSubmit:handleSubmitTask,
    reset:resetTask
   }=useForm<TaskForm>();

   if (loader) return <div className="p-10 text-xl font-bold text-slate-500">Завантаження дошки...</div>;

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

  const Column = ({ title, status, columnTasks }: { title: string, status: TaskStatus, columnTasks: any[] }) => (
    <div 
      className="flex flex-col bg-slate-50/80 rounded-2xl p-4 min-h-[70vh] w-full border border-slate-100 shadow-sm"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, status)}
    >
      <div className="flex items-center justify-between mb-5 px-1">
        <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider flex items-center gap-3">
          {title} 
          <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
            {columnTasks.length}
          </span>
        </h3>
      </div>
      
      <div className="flex flex-col gap-3 relative h-full">
        {columnTasks.map(task => (
          <div 
            key={task.id} 
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
            className="group bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 cursor-grab active:cursor-grabbing hover:border-blue-300 hover:shadow-md transition-all flex flex-col"
          >
            <h4 className="text-sm font-bold text-slate-800 leading-snug mb-1.5">{task.title}</h4>
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">{task.description}</p>
            
            <div className="mt-auto pt-3 border-t border-slate-50 flex justify-between items-center">
             <AssigneeDropDown value={task.assignedHostId || null}
             hosts={host}
             onChange={(hostId)=>assignHost(task.id,hostId)}></AssigneeDropDown>
            </div>
          </div>
        ))}
        <div className="absolute inset-0 z-[-1]"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/30 p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto"> 
   
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
        
            <h1 className="text-4xl font-extrabold text-blue-600 tracking-tight mb-1">
              Організація події
            </h1>
            <p className="text-slate-500 text-sm">Керування завданнями та командою фестивалю</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowHostModal(true)} 
              className="flex items-center justify-center w-12 h-12 rounded-full transition-all text-slate-500 bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 active:scale-95 border border-slate-200 shadow-sm"
              title="Команда"
            >
              <Users className="w-5 h-5" strokeWidth={2.5} />
            </button>
            
            <button 
              onClick={() => setShowTaskModal(true)} 
              className="flex items-center justify-center w-12 h-12 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all active:scale-95"
              title="Нове завдання"
            >
              <Plus className="w-6 h-6" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <Column title="Треба зробити" status={TaskStatus.TODO} columnTasks={todoTask} />
          <Column title="В процесі" status={TaskStatus.IN_PROGRESS} columnTasks={inProgress} />
          <Column title="Виконано" status={TaskStatus.DONE} columnTasks={doneTask} />
        </div>

      </div>

      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-800">
                <LayoutList size={20} className="text-blue-600" />
                <h2 className="text-lg font-bold">Створити завдання</h2>
              </div>
              <button onClick={() => { setShowTaskModal(false); resetTask(); }} className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-200 rounded-md">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitTask(onTaskSubmit)} className="flex flex-col">
              <div className="p-6 flex flex-col gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 size={14}/> Короткий підсумок
                  </label>
                  <input 
                    {...registerTask('title', { required: true })} 
                    placeholder="Наприклад: Перевірити мікрофони"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm text-slate-800 placeholder:text-slate-400" 
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText size={14}/> Детальний опис
                  </label>
                  <textarea 
                    {...registerTask('description', { required: true })} 
                    placeholder="Опишіть, що саме потрібно зробити..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm text-slate-800 placeholder:text-slate-400 resize-none h-28" 
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => { setShowTaskModal(false); resetTask(); }} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors shadow-sm">
                  Скасувати
                </button>
                <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
                  Створити завдання
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showHostModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col">
            
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
              <div className="flex items-center gap-2 text-slate-800">
                <UserPlus size={20} className="text-blue-600" />
                <h2 className="text-lg font-bold">Додати учасника команди</h2>
              </div>
              <button onClick={() => { setShowHostModal(false); resetHost(); }} className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-200 rounded-md">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitHost(onHostSubmit)} className="flex flex-col">
              <div className="p-6 flex flex-col gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText size={14}/> Ім'я та Прізвище
                  </label>
                  <input 
                    {...registerHost('fullname', { required: true })} 
                    placeholder="Наприклад: Іван Франко"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm text-slate-800 placeholder:text-slate-400" 
                  />
                </div>
               <label className="flex text-xs font-bold test-slate-500 uppercase tracking-wider items-center mb-2 gap-1.5">
                <Briefcase size={14}/>Роль на фестивалі
               </label>
               <input type="hidden" {...registerHost('role',{required:true})}/>
               <DropDowmMenu value={watchHost('role')}
               onChange={(val)=>setHostValue('role',val,{shouldValidate:true})}/>
               
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-xl">
                <button type="button" onClick={() => { setShowHostModal(false); resetHost(); }} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors shadow-sm">
                  Скасувати
                </button>
                <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
                  Додати <UserPlus size={16}/>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}