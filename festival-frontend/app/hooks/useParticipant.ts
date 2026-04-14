import { useState, useEffect, useCallback } from 'react';

interface Prize{
  id:string;
  title:string;
  description:string;
}
interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  groupName: string;
  performanceGenre: string;
  tour1Score: number;
  tour2Score: number;
  tour3Score: number;
  songTitle:string;
  photoBase64?:string;
  allocatedSemiFinal:number;
  prize?: Prize | null;
  venue?: { name: string, capacity: number }
  country?:string;
  performanceOrder?:number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL + '/api/participants';

export function useParticipants() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loader, setLoader] = useState(true);
  const [isJuryReady, setIsJuryReady] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setLoader(true);
    try {
      const [partRes, juryRes] = await Promise.all([
        fetch(API_URL),
        fetch(process.env.NEXT_PUBLIC_API_URL + '/api/jury/ready')
      ]);
      
      if (partRes.ok) setParticipants(await partRes.json());
      if (juryRes.ok) setIsJuryReady(await juryRes.json());
    } catch (error) {
      console.error('Помилка завантаження даних', error);
    } finally {
      setLoader(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addParticipant = async (newParticipant: any) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newParticipant),
      });
      if (res.ok) {
        await fetchData();
        return true;
      }
    } catch (error) {
      console.error('Помилка при додаванні', error);
    }
    return false;
  };

  const updateParticipant = async (id: string, updatedData: any) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        await fetchData();
        return true;
      }
    } catch (error) {
      console.error("Помилка при оновленні", error);
    }
    return false;
  };

  const evaluateParticipant = async (payload: any) => {
  try {
    const res = await fetch(`${API_URL}/eurovision-evaluate`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const responseText = await res.text();
    
    if (!res.ok) {
      let errorMessage = "Помилка сервера";
      try {
      
        const errorJson = JSON.parse(responseText);
        errorMessage = errorJson.error || errorJson.message || errorMessage;
      } catch (e) {
      
        errorMessage = responseText || `Помилка ${res.status}`;
      }
      return { success: false, error: errorMessage };
    }
    
    await fetchData(); 
    return { success: true };
  } catch (error) {
    console.error("Помилка при оцінюванні", error);
    return { success: false, error: "Помилка з'єднання з сервером" };
  }
};

  const deleteParticipant = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchData();
        return true;
      }
    } catch (error) {
      console.error("Помилка при видаленні", error);
    }
    return false;
  };

  const conductAllocationDraw=async ()=>{
    try {
       const res=await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/participants/draw',{method:'POST'})
         if(res.ok){
          const updatedParticipants=await res.json()
          setParticipants(updatedParticipants)
          return true
         }
         return false
    } catch (error) {
      console.error('Помилка заватаження учасників',error)
      return false
    }
  }

  const getGrandFinalist=async()=>{
    try {
      const res=await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/participants/finalists')
      if(res.ok){
        return await res.json()
      }
      return[]
    } catch (error) {
      console.error('Помилка завантаження фіналістів',error)
      return []
    }
  }

  return {
    participants,
    loader,
    isJuryReady,
    addParticipant,
    updateParticipant,
    evaluateParticipant,
    deleteParticipant,
    conductAllocationDraw,
    getGrandFinalist
  };
}