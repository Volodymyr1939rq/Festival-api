"use client"

import { Pencil, Trash2, Music, User } from "lucide-react";
import { CountryBadge } from "./CountryBadge";
import { Participant } from "../types";

interface ParticipantCardProps {
  participant: Participant;
  onEdit: (p: Participant) => void;
  onDelete: (p: Participant) => void;
}

export default function ParticipantCard({ participant: p, onEdit, onDelete }: ParticipantCardProps) {
  return (
    <div className="relative group rounded-4xl overflow-hidden aspect-2/3 shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-[#050505]">

      <div className="absolute inset-0 z-0 bg-[#0a0a0a]/20">
        {p.photoBase64 ? (
          <img 
            src={p.photoBase64} 
            alt={`${p.firstName} ${p.lastName}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <User 
              size={400} 
              strokeWidth={0.5} 
              className="text-neutral-700 transition-transform duration-700 group-hover:scale-105 translate-y-12" 
            />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
      </div>

      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-40 transform translate-x-2 group-hover:translate-x-0">
        <button onClick={() => onEdit(p)} className="p-3 bg-white/10 hover:bg-blue-500 backdrop-blur-md rounded-full text-white transition-all">
          <Pencil size={18} />
        </button>
        <button onClick={() => onDelete(p)} className="p-3 bg-white/10 hover:bg-red-500 backdrop-blur-md rounded-full text-white transition-all">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 flex flex-col items-center z-30 pointer-events-none">
        <h2 className="text-3xl md:text-4xl font-black text-white text-center uppercase tracking-tighter mb-4 drop-shadow-2xl">
          {p.firstName} {p.lastName}
        </h2>

        <div className="flex items-center justify-between gap-3 w-full px-1"> 
          <div className="relative flex items-center justify-center bg-[#1a1525]/80 backdrop-blur-sm text-white py-1.5 rounded-full shadow-md border border-white/10 flex-1 min-w-0">
            <div className="absolute left-3 flex items-center pointer-events-none">
              <Music size={14} className="text-white/70" />
            </div>
            <span className="font-bold text-xs uppercase tracking-wider truncate w-full text-center mx-5">
              {p.songTitle}
            </span>
          </div>
          {p.country && (
            <CountryBadge country={p.country}/>
          )}
        </div>
      </div>

    </div>
  );
}