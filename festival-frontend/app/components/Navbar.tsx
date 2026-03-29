"use client"

import  Link  from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar(){
    const pathname=usePathname()

    const navLinks=[
        {name:'Учасники',href:'/'},
        {name:'Журі',href:'/jury'},
        {name:'Таблиця завдань',href:'/tasks'},
        {name:'Глядачі',href:'/spectator'},
    ]

    return (
        <nav className="hidden md:flex flex-1 justify-end gap-6 lg:gap-10 ml-8">
            {navLinks.map((link)=>{
               const isActive=pathname===link.href

               return (
                <Link key={link.href}
                href={link.href}
                className={`relative text-lg font-bold py-2 transition-colors ${
                    isActive ? 'text-slate-900' : 'text-slate-400 hover:text-slate-900'
                }`}
                >
                 {link.name}
                </Link>
               )
            })}
        </nav>
    )
}

