"use client"

interface EurovisionTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function EurovisionTabs({ activeTab, setActiveTab }: EurovisionTabsProps) {

  const tabs = [
    { id: 'all', label: 'Всі учасники' },
    { id: 'sf1', label: 'Перший півфінал' },
    { id: 'sf2', label: 'Другий півфінал' },
    { id: 'final', label: 'Фінал' }
  ];

  return (

    <div className="sticky top-4 z-50 flex justify-center w-full mb-8 transition-all duration-300 py-2">
      
      <div className="flex items-center gap-1 sm:gap-4 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full bg-[#0a1128]/95 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-x-auto no-scrollbar max-w-full">
        
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-2 text-sm sm:text-base whitespace-nowrap transition-all duration-300 ${
              activeTab === tab.id 
                ? "text-white font-bold drop-shadow-md" 
                : "text-neutral-400 hover:text-white font-medium"
            }`}
          >
            {tab.label}
            
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-rose-500 rounded-t-full shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-in fade-in zoom-in duration-300" />
            )}
          </button>
        ))}
        
      </div>
    </div>
  );
}