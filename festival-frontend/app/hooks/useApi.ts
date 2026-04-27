import { useCallback, useEffect, useState } from "react";

export function useApi<T>(url: string) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);

    const getAuthHeaders = () => {
     
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        return {
            'Content-Type': 'application/json',
           
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: getAuthHeaders(),
            });
            
            if (res.ok) {
                const data = await res.json();
                setData(data);
            } else if (res.status === 403 || res.status === 401) {
                console.error('Помилка авторизації: Немає доступу до', url);
            }
        } catch (error) {
            console.error('Помилка завантаження даних', error);
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addItem = async (newItem: any) => {
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: getAuthHeaders(), 
                body: JSON.stringify(newItem)
            });
            if (res.ok) {
                await fetchData();
                return true;
            } else {
                console.error('Помилка сервера при додаванні', res.status);
            }
        } catch (error) {
            console.error('Помилка при додаванні', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`${url}/${id}`, {
                method: "DELETE",
                headers: getAuthHeaders(), 
            });
            if (res.ok) {
                await fetchData();
                return true;
            } else {
                console.error('Помилка сервера при видаленні', res.status);
            }
        } catch (error) {
            console.error('Помилка при видаленні користувача', error);
        }
    };

    return { data, loading, addItem, handleDelete };
}