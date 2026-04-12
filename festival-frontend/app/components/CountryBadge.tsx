"use client"

import { getFlagUrl } from "./CountryList";

interface CountryBadgeProps{
    country:string | undefined;
}

export function CountryBadge({country}:CountryBadgeProps){
    if(!country) return null
    const countryName=country.includes(' ') ? country.split(' ').slice(1).join(' '):country;
    return (
        <div className="relative flex items-center group cursor-default z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)] ml-4">
        
        
            <div className="bg-white text-[#0a113e] pl-10 pr-6 h-7 flex items-center rounded-r-full font-extrabold text-[15px] tracking-wide">
             {countryName}
            </div>
        
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 group-hover:scale-105 transition-transform duration-300 w-12 h-12">
             
              <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full text-white fill-current">
          <path d="M12 21.593c-7.373-6.702-10-9.873-10-13.093 0-2.465 1.874-4.5 4.5-4.5 1.743 0 3.41.81 4.5 2.09 C12.5 3.5 14 1.5 16.5 1.5 c2.8 0 5 2.2 5 5.5 c0 3.5-2.5 6.5-9.5 14.593z"/>
        </svg>
      
        {/* 2. Маска прапора з тим самим асиметричним контуром */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${getFlagUrl(country)}')`,
            WebkitMaskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 21.593c-7.373-6.702-10-9.873-10-13.093 0-2.465 1.874-4.5 4.5-4.5 1.743 0 3.41.81 4.5 2.09 C12.5 3.5 14 1.5 16.5 1.5 c2.8 0 5 2.2 5 5.5 c0 3.5-2.5 6.5-9.5 14.593z'/%3E%3C/svg%3E")`,
            WebkitMaskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 21.593c-7.373-6.702-10-9.873-10-13.093 0-2.465 1.874-4.5 4.5-4.5 1.743 0 3.41.81 4.5 2.09 C12.5 3.5 14 1.5 16.5 1.5 c2.8 0 5 2.2 5 5.5 c0 3.5-2.5 6.5-9.5 14.593z'/%3E%3C/svg%3E")`,
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            transform: 'scale(0.68)' 
          }}
        />
        
            </div>
          </div>
    )
}