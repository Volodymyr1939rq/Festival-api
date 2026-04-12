"use client"

import { useEffect, useRef, useState } from "react";
import CountryList, { COUNTRIES, getFlagUrl } from "./CountryList";

interface CountrySelectProps {
  value: string;
  onChange: (value:string) => void;
  name?: string;
}

export function CountrySelect({ value, onChange, name = "country" }: CountrySelectProps) {
  const [open,setOpen]=useState(false);
  const dropdownRef=useRef<HTMLDivElement>(null)

  useEffect(()=>{
    const handleClickOurSide=(event:MouseEvent)=>{
      if(dropdownRef.current && !dropdownRef.current.contains(event.target as Node)){
        setOpen(false);
      }
    }
    document.addEventListener("mousedown",handleClickOurSide)
    return ()=>document.removeEventListener("mousedown",handleClickOurSide)
  },[])

  const handleSelect=(countryValue:string)=>{
    onChange(countryValue)
    setOpen(false)
  }

  const selectedCountry=COUNTRIES.find(c=>`${c.flag} ${c.name}`===value)
 return (
    <div className="relative w-full" ref={dropdownRef}>
      
    
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none flex items-center justify-between cursor-pointer font-medium transition-all shadow-sm"
      >
        {selectedCountry ? (
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-neutral-700 shrink-0 shadow-sm">
              <img 
                src={getFlagUrl(selectedCountry.name)} 
                alt={selectedCountry.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <span>{selectedCountry.name}</span>
          </div>
        ) : (
          <span className="text-neutral-500">Оберіть країну...</span>
        )}

        <svg
          className={`fill-current h-4 w-4 text-neutral-400 transition-transform duration-300 ${open ? 'rotate-180 text-pink-500' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </button>

      {open && (
        <CountryList 
          currentValue={value} 
          onSelect={handleSelect} 
        />
      )}
      
    </div>
  );
}