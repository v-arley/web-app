import { Activity, MapPin } from "lucide-react";

function AlertBox({ type, title, location, time, severity }: { type: 'orange'|'blue', title: string, location: string, time: string, severity: string }) {
    const isOrange = type === 'orange';
    const colorClass = isOrange ? 'text-[#f05a28]' : 'text-[#2563eb]';
    const bgClass = isOrange ? 'bg-[#fff7f5]' : 'bg-[#f2f8ff]';
    const badgeBg = isOrange ? 'bg-[#f05a28]' : 'bg-[#2563eb]';
    
    return (
        <div className={`${bgClass} p-4 flex flex-col gap-3 shadow-sm`}>
            <div className="flex justify-between items-start gap-4">
                <span className={`text-[10px] font-mono font-bold tracking-widest uppercase ${colorClass} leading-tight`}>{title}</span>
                <span className="text-[9px] font-mono text-[#999] whitespace-nowrap">{time}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
                <div className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-[#a0a0a0]" />
                    <span className="text-[9px] font-mono text-[#a0a0a0] tracking-[0.15em] uppercase">{location}</span>
                </div>
                <div className={`${badgeBg} text-white text-[8px] px-2 py-1 font-mono font-bold tracking-widest uppercase shadow-sm`}>
                    {severity}
                </div>
            </div>
        </div>
    );
}

export function DashboardView() {
    return (
        <div className="w-full h-full flex flex-col bg-[#f0f2f5] overflow-y-auto">
            {/* Top Bar Navigation */}
            <div className="w-full bg-[#e5e7eb] px-8 py-3 flex items-center justify-between">
                <div className="text-[12px] font-mono tracking-[0.2em] text-[#888] uppercase font-bold">
                    Dashboard
                </div>
            </div>

            {/* Main Content Areas */}
            <div className="flex flex-col gap-6 p-4 md:p-4 w-full max-w-[1600px] mx-auto min-h-0">  

                {/* Top Statistics Row */}
                <div className="flex flex-col md:flex-row gap-6 w-full shrink-0">
                    <div className="flex-1 bg-white shadow-sm p-6 flex flex-col items-center justify-center gap-2">
                        <span className="text-[10px] font-mono text-[#888] uppercase tracking-[0.2em]">Total Survivors</span>
                        <span className="text-[40px] font-bold text-black font-mono leading-none">250</span>
                        <span className="text-[9px] font-mono text-[#aaa] uppercase tracking-[0.15em]">+12 Since Last Cycle</span>
                    </div>

                    <div className="flex-1 bg-white shadow-sm p-6 flex flex-col items-center justify-center gap-2">
                        <span className="text-[10px] font-mono text-[#888] uppercase tracking-[0.2em]">Active Exploration</span>
                        <span className="text-[40px] font-bold text-[#f05a28] font-mono leading-none">45</span>
                        <span className="text-[9px] font-mono text-[#aaa] uppercase tracking-[0.15em]">3 Zones Currently Monitored</span>
                    </div>

                    <div className="flex-1 bg-white shadow-sm p-6 flex flex-col items-center justify-center gap-2">
                        <span className="text-[10px] font-mono text-[#888] uppercase tracking-[0.2em]">Deceased Personnel</span>
                        <span className="text-[40px] font-bold text-red-600 font-mono leading-none">07</span>
                        <span className="text-[9px] font-mono text-[#aaa] uppercase tracking-[0.15em]">Stable Since Day 42</span>
                    </div>
                </div>

                {/* 3-Column Layout */}
                <div className="flex flex-col xl:flex-row gap-6 w-full flex-1 min-h-[550px]">
                    
                    {/* Left Column (Resources & Tasks) */}
                    <div className="w-full xl:w-[280px] 2xl:w-[320px] flex flex-col gap-6 shrink-0">
                        {/* Critical Resources */}
                        <div className="bg-white shadow-sm p-6 flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold text-[#888] uppercase tracking-[0.2em]">Critical Resources</span>
                                <Activity size={14} className="text-[#f05a28]" />
                            </div>
                            <div className="flex flex-col gap-5">
                                <div className="flex flex-col gap-2.5">
                                    <div className="flex justify-between items-center text-[9px] font-mono font-bold text-[#666] tracking-[0.15em] uppercase">
                                        <span>Oxygen Reserves</span>
                                        <span>82%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 overflow-hidden">
                                        <div className="h-full bg-gray-300 w-[82%]"></div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2.5">
                                    <div className="flex justify-between items-center text-[9px] font-mono font-bold text-[#666] tracking-[0.15em] uppercase">
                                        <span>Power Core</span>
                                        <span className="text-[#f05a28]">24%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 overflow-hidden">
                                        <div className="h-full bg-[#f05a28] w-[24%]"></div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2.5">
                                    <div className="flex justify-between items-center text-[9px] font-mono font-bold text-[#666] tracking-[0.15em] uppercase">
                                        <span>Water Supply</span>
                                        <span>65%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 overflow-hidden">
                                        <div className="h-full bg-gray-300 w-[65%]"></div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2.5">
                                    <div className="flex justify-between items-center text-[9px] font-mono font-bold text-[#666] tracking-[0.15em] uppercase">
                                        <span>Fuel Cells</span>
                                        <span className="text-red-500">12%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 overflow-hidden">
                                        <div className="h-full bg-red-500 w-[12%]"></div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2.5">
                                    <div className="flex justify-between items-center text-[9px] font-mono font-bold text-[#666] tracking-[0.15em] uppercase">
                                        <span>Surgical Kits</span>
                                        <span>90%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 overflow-hidden">
                                        <div className="h-full bg-gray-300 w-[90%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Active Tasks */}
                        <div className="bg-white shadow-sm p-6 flex flex-col gap-5 flex-1 justify-start">
                            <span className="text-[10px] font-mono font-bold text-[#888] uppercase tracking-[0.2em]">Active Tasks</span>
                            
                            <div className="bg-gray-50/50 p-4 flex justify-between items-center shadow-sm">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[11px] font-mono font-bold text-[#333] tracking-[0.05em]">Thermal Shield Repair</span>
                                    <span className="text-[9px] font-mono text-[#a0a0a0] tracking-widest uppercase">Stephen Cole</span>
                                </div>
                                <div className="w-1.5 h-1.5 bg-[#f05a28] shadow-[0_0_4px_rgba(240,90,40,0.5)]"></div>
                            </div>

                            <div className="bg-gray-50/50 p-4 flex justify-between items-center shadow-sm">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[11px] font-mono font-bold text-[#333] tracking-[0.05em]">Security Protocol Update</span>
                                    <span className="text-[9px] font-mono text-[#a0a0a0] tracking-widest uppercase">Marcus Thorne</span>
                                </div>
                                <div className="w-1.5 h-1.5 bg-[#f05a28] shadow-[0_0_4px_rgba(240,90,40,0.5)]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Center Column (Map Display) */}
                    <div className="flex-1 min-h-[400px] bg-[#141416] p-4 relative overflow-hidden shadow-lg">
                        {/* Sector Info Widget */}
                        <div className="absolute top-6 left-6 bg-white/95 px-6 py-4 flex flex-col gap-1.5 shadow-xl">
                            <span className="text-[9px] font-mono text-[#888] tracking-[0.2em] font-bold uppercase mb-1">Sector Alpha</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold font-mono text-black">2,847</span>
                                <span className="text-[9px] font-mono text-[#888] uppercase tracking-widest">Units</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[9px] font-mono text-[#16a34a] font-bold uppercase tracking-[0.1em]">Live Feed</span>
                                <div className="w-1.5 h-1.5 bg-[#22c55e] animate-pulse"></div>
                            </div>
                        </div>

                        {/* Center Hub Indicator */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-3">
                                <div className="relative flex items-center justify-center">
                                    <div className="w-6 h-6 bg-transparent flex items-center justify-center">
                                        <div className="w-2 h-2 bg-[#f05a28] shadow-[0_0_8px_rgba(240,90,40,0.8)]"></div>
                                    </div>
                                </div>
                                
                                <div className="bg-black/80 backdrop-blur-md px-5 py-3 flex flex-col items-center gap-1.5">
                                    <span className="text-[10px] font-mono font-bold text-white tracking-[0.15em] uppercase">Main Hub</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-[#22c55e] shadow-[0_0_5px_rgba(34,197,94,0.6)]"></div>
                                        <span className="text-[9px] font-mono text-[#aaa] tracking-widest uppercase">76 Personnel</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (System Alerts) */}
                    <div className="w-full xl:w-[300px] 2xl:w-[350px] shrink-0">
                        <div className="bg-white justify-start h-full shadow-sm p-6 flex flex-col gap-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-mono font-bold text-[#888] uppercase tracking-[0.2em]">System Alerts</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-500 animate-[pulse_2s_ease-in-out_infinite]"></div>
                                    <span className="text-[9px] font-mono font-bold text-red-500 uppercase tracking-widest">Live</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 overflow-y-auto">
                                <AlertBox type="orange" title="Unauthorized Access" location="Main Lab" time="15m ago" severity="Medium" />
                                <AlertBox type="blue" title="Low Power Warning" location="Storage A" time="45m ago" severity="Low" />
                                <AlertBox type="orange" title="Comm Link Unstable" location="External Array" time="1h ago" severity="Medium" />
                                <AlertBox type="blue" title="Temperature Variance" location="Hydroponics" time="3h ago" severity="Low" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
