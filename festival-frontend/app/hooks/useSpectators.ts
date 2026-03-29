import { useCallback, useEffect, useState } from "react"

export interface Spectator{
    id:string,
    fullName:string,
    ticketNumber:string
}

const API_URL='http://localhost:8080/api/spectators'

export function useSpectators(){
  const [spectators,setSpectators]=useState<Spectator[]>([])
  const [loader,setLoader]=useState(false)

  const fetchSpectator= useCallback(async()=>{
    setLoader(true)
    try {
        const res=await fetch(API_URL)
        if(res.ok) setSpectators(await res.json())
    } catch (error) {
        console.error("помилка завантаження даних",error)
    }finally{
        setLoader(false)
    }
  },[])

  useEffect(()=>{
    fetchSpectator()
  },[fetchSpectator])

  const addSpectator=async(spectators:{fullName:string,ticketNumber:string})=>{
    try {
        const res=await fetch(API_URL,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(spectators)
        })
        if(res.ok) {await fetchSpectator(); return true;}
    } catch (error) {
        console.error('Помилка',error)
        return false
    }
  }

  const deleteSpectator=async(id:string)=>{
    try {
        const res=await fetch(`${API_URL}/${id}`,{
            method:'DELETE'
        })
        if(res.ok){await fetchSpectator();return true}
    } catch (error) {
        console.error('помилка',error)
        return false;
    }
  }

  return {spectators,loader,addSpectator,deleteSpectator}
}