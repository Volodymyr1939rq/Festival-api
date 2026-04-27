"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

 interface FormInput {
    username:string;
    password:string;
}

interface JwtPayload {
   sub:string;
   role:string;
   iat:number;
   exp:number;
}

export default function Page(){
    const router=useRouter();
    const [serverError,setServerError]=useState<string>("")

    const {
        register,
        handleSubmit,
        formState:{errors,isSubmitting}
    }=useForm<FormInput>();
    
    const onSubmit=async(data:any)=>{
        setServerError('')
        try {
            const res=await fetch(process.env.NEXT_PUBLIC_API_URL+"/api/auth/login",{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(data)
            })
            if(res.ok){
                const result=await res.json()
                localStorage.setItem('token',result.token)
                const payload=result.token.split('.')[1]
                const decodedPayload=JSON.parse(atob(payload)) as JwtPayload

                const Userrole=decodedPayload.role
                localStorage.setItem('userRole',Userrole)
                if(Userrole.includes("ADMIN")){
                    router.push('/')
                }else if(Userrole.includes("JURY")){
                    router.push('/jury')
                }else{
                    router.push('/spectator')
                }
            }else if(res.status===401 || res.status===403){
                setServerError('Неправильний логін або пароль')
            }else{
                setServerError('Помилка сервера')
            }
        } catch (error) {
            setServerError('Відсутній звязок із сервером')
        }
    }
  return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0212] px-4 relative overflow-hidden">
         
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="max-w-md w-full space-y-8 bg-[#11051f]/90 backdrop-blur-xl p-10 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 relative z-10">
                
                <div>
                    <h2 className="text-center text-3xl font-black text-white tracking-wider drop-shadow-lg" style={{ fontFamily: 'Impact, sans-serif' }}>
                        АртФест
                    </h2>
                    <p className="mt-2 text-center text-sm text-white/60">
                        Увійдіть у свій обліковий запис
                    </p>
                </div>

                {serverError && (
                    <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-center">
                        <p className="text-sm text-red-400 font-medium">{serverError}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Логін
                            </label>
                            <input
                                type="text"
                                className={`w-full px-4 py-3 bg-black/30 border ${errors.username ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors`}
                                placeholder="Введіть свій логін"
                                {...register('username', { required: 'Логін обов\'язковий' })}
                            />
                            {errors.username && <p className="mt-2 text-xs text-red-400">{errors.username.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Пароль
                            </label>
                            <input
                                type="password"
                                className={`w-full px-4 py-3 bg-black/30 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors`}
                                placeholder="Введіть пароль"
                                {...register('password', { required: 'Пароль обов\'язковий' })}
                            />
                            {errors.password && <p className="mt-2 text-xs text-red-400">{errors.password.message}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3.5 px-4 rounded-xl text-white font-bold tracking-wide transition-all ${
                            isSubmitting 
                                ? 'bg-white/20 cursor-not-allowed' 
                                : 'bg-linear-to-r from-blue-500 via-pink-500 to-orange-500 hover:opacity-90 shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_25px_rgba(236,72,153,0.5)]'
                        }`}
                    >
                        {isSubmitting ? 'Перевірка...' : 'Увійти'}
                    </button>
                </form>
            </div>
        </div>
    );
} 