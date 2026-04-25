
export function CampsView() {
    return (
        <div className="w-full h-full flex flex-col bg-bg-app overflow-y-auto">
            {/* Top Bar Navigation */}
            <div className="w-full bg-bg-secondary border-b border-border-default px-8 py-3 flex items-center justify-between">
                <div className="text-[12px] font-mono tracking-[0.2em] text-txt-secondary uppercase font-bold">
                    Camps
                </div>
                <div className="flex bg-bg-tertiary p-1 border border-border-default gap-1">
                    <button className="px-6 text-[11px] font-bold bg-bg-selected text-accent shadow-sm uppercase font-mono tracking-widest">Tasks</button>
                    <button className="px-6 text-[11px] font-bold text-txt-secondary hover:bg-bg-selected uppercase font-mono tracking-widest transition-colors cursor-pointer">Rations</button>
                    <button className="px-6 text-[11px] font-bold text-txt-secondary hover:bg-bg-selected uppercase font-mono tracking-widest transition-colors cursor-pointer">Explorations</button>
                </div>
            </div>

            {/* Main Content Areas */}
            <div className="flex flex-col lg:flex-row gap-12 p-12 w-full max-w-6xl mx-auto w-full h-full">  

            </div>
        </div>
    );
}
