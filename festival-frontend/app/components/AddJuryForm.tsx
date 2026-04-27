"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { AlertCircle } from "lucide-react"

export interface JuryFormData {
  fullName: string
  qualification: string
}

interface AddJuryFormProps {
  addItem: (payload: any) => Promise<boolean | undefined>
  onSuccess: () => void
}

export default function AddJuryForm({ addItem, onSuccess }: AddJuryFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [photoBase64, setPhotoBase64] = useState<string>("")

  const { register, handleSubmit, reset, formState: { errors } } = useForm<JuryFormData>()

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoBase64(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: JuryFormData) => {
    setError(null)
    const payload = {
      ...data,
      photoBase64: photoBase64
    }
    const success = await addItem(payload)
    if (success) {
      reset()
      setPhotoBase64("")
      onSuccess() 
    } else {
      setError('Кількість суддів не може бути більшою за 7. Журі укомплектовано!')
    }
  }

  return (
    <div className="bg-neutral-900 p-8 rounded-4xl border border-neutral-800 shadow-2xl mb-12 animate-in fade-in slide-in-from-top-4 duration-300 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-pink-500 to-orange-500"></div>
      <h2 className="text-2xl font-extrabold mb-6 text-white tracking-tight">Реєстрація експерта</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/50 text-rose-400 rounded-xl flex items-center gap-3 text-sm font-bold shadow-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} className="text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">ПІБ судді</label>
            <input 
              {...register("fullName", { required: true })} 
              placeholder="Напр. Тіна Кароль" 
              className="w-full border border-neutral-700 bg-neutral-800 text-white placeholder-neutral-600 p-4 rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all font-medium" 
            />
            {errors.fullName && <span className="text-xs text-rose-500 mt-2 block font-bold">Це поле є обов'язковим</span>}
          </div>
          
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Сфера / Кваліфікація</label>
            <input 
              {...register("qualification", { required: true })} 
              placeholder="Напр. Вокал, Хореографія" 
              className="w-full border border-neutral-700 bg-neutral-800 text-white placeholder-neutral-600 p-4 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all font-medium" 
            />
            {errors.qualification && <span className="text-xs text-rose-500 mt-2 block font-bold">Це поле є обов'язковим</span>}
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Фотографія (необов'язково)</label>
          <div className="flex items-center gap-6">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoUpload}
              className="w-full text-sm text-neutral-400 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-pink-500/10 file:text-pink-400 hover:file:bg-pink-500/20 transition-all cursor-pointer"
            />
            {photoBase64 && (
              <img 
                src={photoBase64} 
                alt="Preview" 
                className="w-14 h-14 object-cover rounded-full border-2 border-neutral-700 shadow-lg shrink-0" 
              />
            )}
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button type="submit" className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-10 py-3.5 rounded-full font-extrabold shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all active:scale-95">
            Зберегти
          </button>
        </div>
      </form>
    </div>
  )
}