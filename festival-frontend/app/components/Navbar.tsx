"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, User } from "lucide-react"

export default function Navbar() {
    const pathname = usePathname()
    
    const navLinks = [
        { name: 'Учасники', href: '/' },
        { name: 'Журі', href: '/jury' },
        { name: 'Таблиця завдань', href: '/tasks' },
        { name: 'Глядачі', href: '/spectator' },
        { name: 'Результат', href: '/results' }
    ]

    return (
        <header className="absolute top-4 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
            
            <div className="w-full max-w-7xl bg-[#11051f]/85 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.5)] pointer-events-auto">
                
                <div className="flex items-center gap-4 min-w-50">
                    <div className="bg-linear-to-br from-blue-500 via-pink-500 to-orange-500 p-1.5 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                        <Heart size={20} className="text-white" fill="white" />
                    </div>
                    <Link href="/">
                        <span className="text-2xl md:text-3xl font-black text-white tracking-wider drop-shadow-lg" style={{ fontFamily: 'Impact, sans-serif' }}>
                            АртФест
                        </span>
                    </Link>
                </div>

            
                <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 flex-1">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href
                        return (
                            <Link 
                                key={link.href}
                                href={link.href}
                              
                                className={`relative whitespace-nowrap text-[15px] font-bold py-2 transition-all ${
                                    isActive 
                                    ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
                                    : 'text-white/70 hover:text-white'
                                }`}
                            >
                                {link.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="flex items-center justify-end gap-6 min-w-50">
                    <Link href={'/auth'}
                    className="text-white/80 hover:text-white transition-colors hidden sm:block"
                    title="Увійти">

                        <User size={22} strokeWidth={2.5} />
                    </Link>
                    <Link 
        href="/auth"
        className="bg-white text-neutral-900 hover:bg-neutral-200 px-6 py-2.5 rounded-full text-sm font-extrabold transition-colors shadow-md whitespace-nowrap"
    >
        Мій профіль
    </Link>
                </div>
                
            </div>
        </header>
    )
}