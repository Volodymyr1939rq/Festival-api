"use client"

import { useState } from "react";
import { TaskStatus, useTasks } from "../hooks/useTask"
import { Plus, Users } from "lucide-react";
import AssigneeDropDown from "../components/AssigneeDropDown";
import AddHostModal from "../components/AddHostModal";
import AddTaskModal from "../components/AddTaskModal";
import { AdminView } from "../components/AdminView";
import { useAuth } from "../hooks/useAuth"; 

export default function TaskBoard() {
  const { host, task, loader, addHost, addTask, updateTaskStatus, assignHost } = useTasks();
  
  const { isAdmin } = useAuth(); 

  const [showHostModal, setShowHostModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  if (loader) return <div className="p-10 text-xl font-bold text-white/50 flex justify-center min-h-screen bg-[#06041a]">Завантаження бекстейджу...</div>;

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    if (!isAdmin) return e.preventDefault(); 
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (isAdmin) e.preventDefault(); 
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    if (!isAdmin) return;
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) updateTaskStatus(taskId, newStatus);
  };

  const onTaskSubmit = async (data: { title: string, description: string }) => {
    return await addTask({ title: data.title, description: data.description, tourNumber: 1 });
  };
   
  const onHostSubmit = async (data: { fullname: string, role: string }) => {
    return await addHost({ fullName: data.fullname, role: data.role });
  };
   
  const todoTask = task.filter(t => t.status === TaskStatus.TODO);
  const inProgress = task.filter(t => t.status === TaskStatus.IN_PROGRESS);
  const doneTask = task.filter(t => t.status === TaskStatus.DONE);

  const Column = ({ title, status, columnTasks }: { title: string, status: TaskStatus, columnTasks: any[] }) => (
    <div 
      className="flex flex-col bg-white/5 rounded-4xl p-5 min-h-[70vh] w-full border border-white/10 shadow-2xl backdrop-blur-md animate-in fade-in duration-700"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, status)}
    >
      <div className="flex items-center justify-between mb-6 px-2 border-b border-white/10 pb-4">
        <h3 className="font-black text-white text-sm uppercase tracking-widest flex items-center gap-3">
          {title} 
          <span className="bg-linear-to-r from-fuchsia-600 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-[0_0_15px_rgba(217,70,239,0.5)]">
            {columnTasks.length}
          </span>
        </h3>
      </div>
      
      <div className="flex flex-col gap-4 relative h-full">
        {columnTasks.map(task => {
          
          const assignedHostName = host.find(h => h.id === task.assignedHostId)?.fullName;

          return (
          <div 
            key={task.id} 
            draggable={isAdmin} 
            onDragStart={(e) => handleDragStart(e, task.id)}
            
            className={`group bg-[#06041a]/80 backdrop-blur-sm p-5 rounded-3xl shadow-lg border border-white/10 transition-all flex flex-col ${
                isAdmin ? "cursor-grab active:cursor-grabbing hover:border-fuchsia-500/50 hover:shadow-[0_10px_30px_rgba(217,70,239,0.2)] hover:-translate-y-1" : "cursor-default"
            }`}
          >
            <h4 className="text-sm font-black text-white leading-snug mb-2 uppercase tracking-wide">{task.title}</h4>
            <p className="text-xs text-white/50 line-clamp-3 leading-relaxed mb-4">{task.description}</p>
            
            <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
              
              {isAdmin ? (
                <AssigneeDropDown 
                  value={task.assignedHostId || null}
                  hosts={host}
                  onChange={(hostId) => assignHost(task.id, hostId)}
                />
              ) : (
                <div className="text-[11px] font-black text-white/40 uppercase tracking-wider">
                  {assignedHostName ? (
                    <span className="text-fuchsia-400 drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]">{assignedHostName}</span>
                  ) : (
                    <span>Не призначено</span>
                  )}
                </div>
              )}

            </div>
          </div>
        )})}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#06041a] text-white font-sans relative pt-24 pb-20 overflow-hidden">
      
      {/* Динамічні градієнтні плями (Стиль United by Music) */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-rose-600/25 blur-[130px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute top-[5%] right-[-10%] w-[45vw] h-[45vw] bg-blue-600/25 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[5%] right-[5%] w-[50vw] h-[50vw] bg-fuchsia-600/20 blur-[140px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-15%] left-[-5%] w-[45vw] h-[45vw] bg-pink-600/20 blur-[130px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto p-6 md:p-10 relative z-10"> 
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-fuchsia-400 to-rose-400 tracking-tight mb-2 uppercase italic">
              Кулуарний менеджмент
            </h1>
            <p className="text-white/60 font-medium">Керування завданнями, реквізитом та командою фестивалю</p>
          </div>
          
          <div className="flex items-center gap-4">
            <AdminView>
            <button 
              onClick={() => setShowHostModal(true)} 
              className="flex items-center justify-center w-12 h-12 rounded-full transition-all text-white/70 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 backdrop-blur-md shadow-lg"
              title="Команда (Ведучі, Реквізитори)"
            >
              <Users className="w-5 h-5" strokeWidth={2.5} />
            </button>
            </AdminView>

            <AdminView>
            <button 
              onClick={() => setShowTaskModal(true)} 
              className="flex items-center justify-center bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-90 text-white px-6 py-3 rounded-full font-black uppercase text-sm tracking-widest shadow-[0_0_25px_rgba(236,72,153,0.3)] transition-all hover:scale-105 active:scale-95 gap-2"
            >
              <Plus className="w-5 h-5" strokeWidth={3} /> Додати задачу
            </button>
            </AdminView>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <Column title="Треба зробити" status={TaskStatus.TODO} columnTasks={todoTask} />
          <Column title="В процесі" status={TaskStatus.IN_PROGRESS} columnTasks={inProgress} />
          <Column title="Виконано" status={TaskStatus.DONE} columnTasks={doneTask} />
        </div>
      </div>

      {showTaskModal && (
        <AddTaskModal 
          onClose={() => setShowTaskModal(false)} 
          onAdd={onTaskSubmit} 
        />
      )}

      {showHostModal && (
        <AddHostModal 
          onClose={() => setShowHostModal(false)} 
          onAdd={onHostSubmit} 
        />
      )}
    </main>
  );
}