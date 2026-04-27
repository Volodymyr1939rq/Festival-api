import { useEffect, useState } from "react";

export function useAuth(){
    const [userRole,setUserRole]=useState<string | null>(null)
    const [loading,setLoading]=useState(true)

    useEffect(()=>{
        const role=localStorage.getItem('userRole')
        console.log("РОЛЬ З БРАУЗЕРА:", role)
        setUserRole(role)
        setLoading(false)
    },[])

    return {
        userRole,
        isAdmin:userRole==='ROLE_ADMIN',
        isJury:userRole==='ROLE_JURY',
        isSpectator:userRole==='ROLE_SPECTATOR',
        loading
    }
}