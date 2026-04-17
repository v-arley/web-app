import { Map, Shield, Search, Power } from 'lucide-react';

export function CampSettingsView() {
    return (
        <div className="flex flex-col w-full h-full p-8 relative font-ibmplex overflow-y-auto">
            <div className="flex flex-col md:flex-row gap-12 w-full max-w-5xl mx-auto h-full">

                {/* Left Column */}
                <div className="flex-1 flex flex-col gap-4 h-full">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-50 flex items-center justify-center text-[#f05a28]">
                            <Map size={22} className="stroke-[2px]" />
                        </div>
                        <h3 className="text-bold" >INFORMATION</h3>
                    </div>

                    {/* Additional Info Requested by User */}
                    <div className="flex gap-2">
                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest">Camp ID</label>
                            <input type="text" readOnly value="CMP-001" className="w-full px-4 py-2 bg-gray-50 text-[13px] font-bold font-mono text-gray-400 outline-none cursor-not-allowed" />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest">Code</label>
                            <input type="text" readOnly value="ALPHA-X" className="w-full px-4 py-2 bg-gray-50 text-[13px] font-bold font-mono text-gray-400 outline-none cursor-not-allowed" />
                        </div>
                        <div className="flex-[1.5] flex flex-col gap-1">
                            <label className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest">Creation Date</label>
                            <input type="text" readOnly value="2024-01-15" className="w-full px-4 py-2 bg-gray-50 text-[13px] font-bold font-mono text-gray-400 outline-none cursor-not-allowed" />
                        </div>
                    </div>

                    {/* Existing fields in screenshot */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] font-mono">CAMP DESIGNATION</label>
                        <input type="text" defaultValue="CAMP ALPHA" className="w-full px-4 py-2 bg-[#F4F4F5] text-[13px] font-bold font-mono text-gray-800 outline-none focus:ring-2 focus:ring-[#f05a28]/50 transition-all" />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 flex flex-col gap-1 relative">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] font-mono">MAX CAPACITY</label>
                            <input type="number" defaultValue={250} className="w-full px-4 py-2 bg-[#F4F4F5] text-[13px] font-bold font-mono text-gray-800 outline-none focus:ring-2 focus:ring-[#f05a28]/50 transition-all appearance-none" />
                            {/* Custom scroll arrows simulation */}
                            <div className="absolute right-3 top-[34px] flex flex-col gap-[2px] text-gray-400">
                                <div className="cursor-pointer hover:text-gray-600">
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5L5 1L9 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                                <div className="cursor-pointer hover:text-gray-600">
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] font-mono">LATITUDE</label>
                            <input type="text" defaultValue="-70.000" className="w-full px-4 py-2 bg-[#F4F4F5] text-[13px] font-bold font-mono text-gray-800 outline-none focus:ring-2 focus:ring-[#f05a28]/50 transition-all" />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] font-mono">LONGITUDE</label>
                            <input type="text" defaultValue="10.000" className="w-full px-4 py-2 bg-[#F4F4F5] text-[13px] font-bold font-mono text-gray-800 outline-none focus:ring-2 focus:ring-[#f05a28]/50 transition-all" />
                        </div>
                    </div>
                </div>

                {/* Vertical Divider for Desktop Optional */}
                {/* <div className="hidden md:block w-[1px] bg-gray-100 my-4"></div> */}

                {/* Right Column */}
                <div className="flex-1 flex flex-col gap-6 h-full">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#F4F4F5] flex items-center justify-center text-gray-400">
                            <Shield size={22} className="stroke-[2px]" />
                        </div>
                        <h3 className="text-bold">ADMINISTRATIVE CONTROL</h3>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] font-mono">MASTER ADMINISTRATOR</label>
                        <div className="flex bg-[#F4F4F5] p-1 relative items-center">
                            <input type="text" defaultValue="VARGAS" className="w-full px-4 py-1 bg-transparent text-[13px] font-bold font-mono text-gray-800 outline-none" />
                            <button className="w-10 h-10 min-w-10 bg-[#1c1c1c] text-white flex items-center justify-center hover:bg-black transition-colors shadow-sm">
                                <Search size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="p-4 flex items-center justify-between bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 bg-[#f0fdf4] text-[#10b981] flex items-center justify-center overflow-hidden">
                                <Power size={20} className="stroke-[2.5px]" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[12px] font-bold font-mono text-gray-800">SYSTEM NODE STATUS</span>
                                <span className="text-[9px] font-bold text-gray-400 tracking-[0.1em] uppercase font-mono">MAIN CONNECTIVITY TOGGLE</span>
                            </div>
                        </div>
                        <div className="w-[52px] h-[30px] bg-[#10b981] flex items-center px-1 cursor-pointer shadow-inner">
                            {/* Toggle circle */}
                            <div className="w-6 h-6 bg-white translate-x-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.2)]"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col items-center justify-end">
                <span className="text-[10px] font-bold text-gray-300 tracking-[0.15em] uppercase font-mono">LAST SYSTEM SYNC: 12:29:23 AM</span>
            </div>

        </div>
    );
}
