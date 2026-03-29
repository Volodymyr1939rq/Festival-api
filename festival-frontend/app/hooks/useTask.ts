import { useCallback, useEffect, useState } from "react"

export interface Host{
    id:string,
    fullName:string,
    phone?:string,
    role?:string,
}

export enum TaskStatus{
    TODO='TODO',
    IN_PROGRESS='IN_PROGRESS',
    DONE='DONE'
}

export interface FestivalTask{
    id:string,
    title:string,
    description:string,
    tourNumber:number,
    status:TaskStatus,
    assignedHostId?:string
}

const HOST_API='http://localhost:8080/api/hosts'
const TASK_API='http://localhost:8080/api/tasks'

export function useTasks(){
    const [host,setHost]=useState<Host[]>([])
    const [task,setTask]=useState<FestivalTask[]>([])
    const [loader,setLoader]=useState(true)

    const fetchData=useCallback(async()=>{
        setLoader(true)
        try {
            const [hostsRes,tasksRes]=await Promise.all([
                fetch(HOST_API),
                fetch(TASK_API)
            ])
            if(hostsRes.ok) setHost(await hostsRes.json())
            if(tasksRes.ok) setTask(await tasksRes.json())
        } catch (error) {
            console.error('Помилка завантаження ',error)
        }finally{
            setLoader(false)
        }
    },[])

    useEffect(()=>{
        fetchData()
    },[fetchData])

    const addHost=async(newHost:any)=>{
        try {
            const res=await fetch(HOST_API,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(newHost)
            })
            if(res.ok){
                await fetchData();
                return true
            }
        } catch (error) {
            console.error('Помилка',error) 
        }
        return false;
    }

    const addTask=async(newTask:any)=>{
        try {
            const res=await fetch(TASK_API,{
                method:"POST",
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(newTask)
            })
            if(res.ok){
                fetchData()
                return true
            }
        } catch (error) {
            console.error('Помилка',error)
        }
        return false
    }

    const updateTaskStatus=async(taskId:string,status:TaskStatus)=>{
        try {
            const res=await fetch(`${TASK_API}/${taskId}/status?status=${status}`,{
                method:"PUT"
            })
            if(res.ok){
                await fetchData()
                return true
            }
        } catch (error) {
            console.error('Помилка',error)
        }
        return false
    }

    const assignHost=async(taskId:string,hostId:string)=>{
        try {
            const res=await fetch(`${TASK_API}/${taskId}/assign?hostId=${hostId}`,{
                method:"PUT"
            })
            if(res.ok){
                fetchData()
                return true
            }
        } catch (error) {
            console.error('Помилка',error)
        }
        return false
    }
    return {
        host,
        task,
        loader,
        addHost,
        addTask,
        updateTaskStatus,
        assignHost,
    }
}