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
    <div className="relative w-full" ref={dropDowmRef}>
      
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full p-4 bg-neutral-900 border rounded-2xl outline-none flex items-center justify-between transition-all text-sm font-medium ${
          open 
            ? 'border-emerald-500 ring-2 ring-emerald-500/50 bg-neutral-800' 
            : 'border-neutral-700 hover:bg-neutral-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50'
        } ${!value ? 'text-neutral-500' : 'text-white'}`}
      >
        <span className="flex items-center gap-2">
          {selectedRole && SelectedIcon ? (
            <>
              <SelectedIcon size={18} className="text-emerald-500" />
              {selectedRole.label}
            </>
          ) : (
            "Оберіть роль..."
          )}
        </span>
        <ChevronDown size={18} className={`text-neutral-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#111322] border border-neutral-700 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.9)] z-9999 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 flex flex-col gap-1">
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
                  className={`flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all w-full text-left ${
                    isSelected 
                      ? 'bg-emerald-500/10 text-emerald-400 font-bold' 
                      : 'text-neutral-400 hover:bg-white/10 hover:text-white font-medium'
                  }`}
                >
                  <Icon size={18} className={isSelected ? 'text-emerald-500' : 'text-neutral-500'} />
                  <span>{r.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}