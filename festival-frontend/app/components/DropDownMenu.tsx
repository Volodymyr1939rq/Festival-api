"use client"

import { ChevronDown, ClipboardList, Headphones, Lightbulb, Mic } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface roleDropDowmProps{
    value:string,
    onChange:(value:string)=>void
}

export default function DropDowmMenu({value,onChange}:roleDropDowmProps){
    const [open,setOpen]=useState(false)
    const dropDowmRef=useRef<HTMLDivElement>(null);

    const role=[
        {id:'Ведучий',label:'Ведучий',icon:Mic},
        {id:'Звукорежисер',label:'Звукорежисер',icon:Headphones},
        {id:'Світлорежисер',label:'Світлорежисер',icon:Lightbulb},
        {id:'Координатор',label:'Координатор',icon:ClipboardList}
    ]

    const selectedRole=role.find(f=>f.id===value)
    const SelectedIcon=selectedRole?.icon

    useEffect(()=>{
        function handleClickOutSide(event:MouseEvent){
            if(dropDowmRef.current && !dropDowmRef.current.contains(event.target as Node)){
                setOpen(false)
            }
        }
        document.addEventListener("mousedown",handleClickOutSide)
        return()=> document.removeEventListener("mousedown",handleClickOutSide)
    },[])

    return (
        <div className="relative" ref={dropDowmRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full p-2.5 bg-slate-50 border rounded-lg outline-none flex items-center justify-between transition-all text-sm ${
          open 
            ? 'border-blue-500 ring-4 ring-blue-500/10 bg-white' 
            : 'border-slate-200 hover:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
        } ${!value ? 'text-slate-400' : 'text-slate-800'}`}
      >
        <span className="flex items-center gap-2">
          {selectedRole && SelectedIcon ? (
            <>
              <SelectedIcon size={16} className="text-blue-500" />
              {selectedRole.label}
            </>
          ) : (
            "Оберіть роль..."
          )}
        </span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-1 flex flex-col">
            {role.map((r) => {
              const Icon = r.icon;
              const isSelected = value === r.id;
              
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    onChange(r.id); 
                    setOpen(false); 
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 text-sm rounded-md transition-colors w-full text-left ${
                    isSelected ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={16} className={isSelected ? 'text-blue-600' : 'text-slate-400'} />
                  <span className={isSelected ? 'font-bold' : 'font-medium'}>{r.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
    )
}