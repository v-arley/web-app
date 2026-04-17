
export function CampsView() {
    return (
        <div className="w-full h-full flex flex-col bg-[#f0f2f5] overflow-y-auto shadow-inner">
            {/* Top Bar Navigation */}
            <div className="w-full bg-[#e5e7eb] px-8 py-3 flex items-center justify-between">
                <div className="text-[12px] font-mono tracking-[0.2em] text-[#888] uppercase font-bold">
                    Camps
                </div>
                <div className="flex bg-[#d1d5db] p-1 shadow-inner gap-1">
                    <button className="px-6 text-[11px] font-bold bg-white text-[#f05a28] shadow-sm uppercase font-mono tracking-widest">Tasks</button>
                    <button className="px-6 text-[11px] font-bold text-[#666] hover:bg-white/50 uppercase font-mono tracking-widest transition-colors cursor-pointer">Rations</button>
                    <button className="px-6 text-[11px] font-bold text-[#666] hover:bg-white/50 uppercase font-mono tracking-widest transition-colors cursor-pointer">Explorations</button>
                </div>
            </div>

            {/* Main Content Areas */}
            <div className="flex flex-col lg:flex-row gap-12 p-12 w-full max-w-6xl mx-auto w-full h-full">  

            </div>
        </div>
    );
}
