"use client"

import { ChevronDown, ClipboardList, Headphones, Lightbulb, Mic, User } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface Host {
    id:string,
    fullName:string,
    role?:string
}

interface AssigneeDropDownProps{
    value:string | null,
    onChange:(hostId:string)=>void,
    hosts:Host[]
}

export default function AssigneeDropDown({value,onChange,hosts}:AssigneeDropDownProps){
    console.log("Дані команди (hosts):", hosts);
    const [open,setOpen]=useState(false)
    const ref=useRef<HTMLDivElement>(null)

    const findRole=hosts.find(f=>f.id===value)

    useEffect(()=>{
        function handleClickOutSide(e:MouseEvent){
            if(ref.current && !ref.current.contains(e.target as Node)){
               setOpen(false)
            }
        }
        document.addEventListener('mousedown',handleClickOutSide)
        return ()=>document.removeEventListener('mousedown',handleClickOutSide)
    },[])

    const getRoleIcon=(role?:string)=>{
        switch(role){
            case 'Ведучий': return <Mic size={14} className="text-blue-500 shrink-0" />;
            case 'Звукорежисер': return <Headphones size={14} className="text-blue-500 shrink-0" />;
            case 'Світлорежисер': return <Lightbulb size={14} className="text-blue-500 shrink-0" />;
            case 'Координатор': return <ClipboardList size={14} className="text-blue-500 shrink-0" />;
            default: return <User size={14} className="text-slate-400 shrink-0" />;
        }
    }

    return (
        <div className="relative w-full" ref={ref}>
  
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full text-xs font-semibold border rounded-full px-3 py-2 outline-none flex items-center justify-between transition-colors ${
          open 
            ? 'bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-500/20' 
            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          {findRole ? (
            <>
              {getRoleIcon(findRole.role)}
              <span className="truncate">{findRole.fullName}</span>
              {findRole.role && findRole.role.trim() !=='' && (
                <span className="text-slate-400 ml-1 truncate">({findRole.role})</span>
              )}
            </>
          ) : (
            <>
              <User size={14} className="text-slate-400 shrink-0" />
              Призначити...
            </>
          )}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ml-1 shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 w-full min-w-45 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="max-h-48 overflow-y-auto p-1 flex flex-col scrollbar-thin scrollbar-thumb-slate-200">
            {hosts.length === 0 ? (
              <div className="px-3 py-2 text-xs text-slate-500 text-center">Команда порожня</div>
            ) : (
              hosts.map((h) => {
                const isSelected = value === h.id;
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => {
                      onChange(h.id);
                      setOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-colors w-full text-left ${
                      isSelected ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    {getRoleIcon(h.role)}
                    <span className="truncate font-medium">{h.fullName}</span>
                    {h.role && h.role.trim()!=='' && (
                    <span className="text-slate-400 ml-1 truncate">({h.role})</span>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
    )
}