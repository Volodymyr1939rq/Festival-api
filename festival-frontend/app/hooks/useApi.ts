import { useCallback, useEffect, useState } from "react";

export function useApi<T>(url:string){
   const [data,setData]=useState<T[]>([])
   const [loading,setLoading]=useState(true)

   const fetchData=useCallback(async()=>{
    setLoading(true)
    try {
        const res=await fetch(url)
        const data=await res.json()
        setData(data)

    } catch (error) {
        console.error('Помилка завантаження журі',error)
    }finally{
        setLoading(false)
    }
   },[url])

   useEffect(()=>{
    fetchData()
   },[fetchData])

   const addItem=async(newItem:any)=>{
    try {
        const res=await fetch(url,{
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(newItem)
        })
        if(res.ok){
            await fetchData()
            return true
        }
    } catch (error) {
        console.error('Помилка при додаванні журі',error)
    }
   }

   const handleDelete=async(id:string)=>{
    try {
        const res=await fetch(`${url}/${id}`,{method:"DELETE"})
        if(res.ok){
           await fetchData()
           return true
        }
    } catch (error) {
        console.error('Помилка при видаденні користувача',error)
    }
   }
   return {data,loading,addItem,handleDelete}
}