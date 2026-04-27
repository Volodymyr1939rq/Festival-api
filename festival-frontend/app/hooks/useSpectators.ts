import { useCallback, useEffect, useState } from "react"

export interface Spectator {
    id: string,
    fullName: string,
    ticketNumber: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL + '/api/spectators'

export function useSpectators() {
  const [spectators, setSpectators] = useState<Spectator[]>([])
  const [loader, setLoader] = useState(false)

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  const fetchSpectator = useCallback(async () => {
    setLoader(true)
    try {
       
        const res = await fetch(API_URL, { headers: getAuthHeaders() })
        if (res.ok) setSpectators(await res.json())
        else if (res.status === 403) console.error("Немає доступу до глядачів (403)")
    } catch (error) {
        console.error("помилка завантаження даних", error)
    } finally {
        setLoader(false)
    }
  }, [])

  useEffect(() => {
    fetchSpectator()
  }, [fetchSpectator])

  const addSpectator = async (spectators: {fullName: string, ticketNumber: string}) => {
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(spectators)
        })
        if (res.ok) { await fetchSpectator(); return true; }
    } catch (error) {
        console.error('Помилка', error)
        return false
    }
  }

  const deleteSpectator = async (id: string) => {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        })
        if (res.ok) { await fetchSpectator(); return true; }
    } catch (error) {
        console.error('помилка', error)
        return false;
    }
  }

  return { spectators, loader, addSpectator, deleteSpectator }
}