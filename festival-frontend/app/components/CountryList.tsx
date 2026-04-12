"use client"


export const COUNTRIES = [
  { id: "UA", name: "Україна", flag: "🇺🇦" },
  { id: "SE", name: "Швеція", flag: "🇸🇪" },
  { id: "MD", name: "Молдова", flag: "🇲🇩" },
  { id: "HR", name: "Хорватія", flag: "🇭🇷" },
  { id: "GB", name: "Велика Британія", flag: "🇬🇧" },
  { id: "IT", name: "Італія", flag: "🇮🇹" },
  { id: "FR", name: "Франція", flag: "🇫🇷" },
  { id: "FI", name: "Фінляндія", flag: "🇫🇮" },
  { id: "NO", name: "Норвегія", flag: "🇳🇴" },
  { id: "CH", name: "Швейцарія", flag: "🇨🇭" },
  { id: "IL", name: "Ізраїль", flag: "🇮🇱" },
  { id: "ES", name: "Іспанія", flag: "🇪🇸" },
];

export const getFlagUrl=(countryStr: string | undefined)=>{
  if(!countryStr) return ""
  const str=countryStr.toLowerCase();
  if(str.includes("україна")) return "https://flagcdn.com/w80/ua.png";
  if(str.includes("швеція")) return "https://flagcdn.com/w80/se.png";
  if (str.includes("молдова")) return "https://flagcdn.com/w80/md.png";
  if (str.includes("хорватія")) return "https://flagcdn.com/w80/hr.png";
  if (str.includes("британія")) return "https://flagcdn.com/w80/gb.png";
  if (str.includes("італія")) return "https://flagcdn.com/w80/it.png";
  if (str.includes("франція")) return "https://flagcdn.com/w80/fr.png";
  if (str.includes("фінляндія")) return "https://flagcdn.com/w80/fi.png";
  if (str.includes("норвегія")) return "https://flagcdn.com/w80/no.png";
  if (str.includes("швейцарія")) return "https://flagcdn.com/w80/ch.png";
  if (str.includes("ізраїль")) return "https://flagcdn.com/w80/il.png";
  if (str.includes("іспанія")) return "https://flagcdn.com/w80/es.png";
  return "https://flagcdn.com/w80/ua.png";
}

interface CountryListProps{
    currentValue:string,
    onSelect:(value:string)=>void
}

export default function CountryList({ currentValue, onSelect }: CountryListProps) {
  return (
    <ul className="absolute z-50 w-full mt-2 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto py-2 outline-none custom-scrollbar">
      {COUNTRIES.map((c) => {
        const itemValue = `${c.flag} ${c.name}`;
        const isSelected = currentValue === itemValue;

        return (
          <li
            key={c.id}
            onClick={() => onSelect(itemValue)}
            className={`px-4 py-2.5 cursor-pointer flex items-center gap-3 transition-colors ${
              isSelected 
                ? 'bg-pink-500/10 text-pink-400 font-bold' 
                : 'text-white hover:bg-neutral-800'
            }`}
          >
            <div className="w-6 h-6 rounded-full overflow-hidden border border-neutral-700 shrink-0">
              <img 
                src={getFlagUrl(c.name)} 
                alt={c.name} 
                className="w-full h-full object-cover opacity-90"
              />
            </div>
            <span>{c.name}</span>
          </li>
        );
      })}
    </ul>
  );
}