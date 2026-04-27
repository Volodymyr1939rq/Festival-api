
import { useAuth } from "../hooks/useAuth";

export function AdminView({children}:{children:React.ReactNode}){
    const {isAdmin}=useAuth()
    if(!isAdmin) return null

    return <>{children}</>
}