// import { useState } from "react";
// import { CampsView } from "./CampsView.tsx";
// import { TasksView } from "./TasksView.tsx";
// import { ExplorationsView } from "./ExplorationsView.tsx";

// export function CampContainerView() {
//   const [activeTab, setActiveTab] = useState("Camps");

//   const renderContent = () => {
//     switch (activeTab) {
//       case "Tasks":
//         return <TasksView />;
//       case "Explorations":
//         return <ExplorationsView />;
//       case "Camps":
//       default:
//         return <CampsView />;
//     }
//   };

//   return (
//     <div className="w-full h-full flex flex-col bg-[#f0f2f5] overflow-y-auto shadow-inner">
//       <div className="w-full bg-[#e5e7eb] px-8 py-3 flex items-center justify-between">
//         <div className="text-[12px] font-mono tracking-[0.2em] text-[#888] uppercase font-bold">
//           Camp
//         </div>

//         <div className="flex bg-black p-1 shadow-inner gap-1">
//           {["Camps", "Tasks", "Explorations"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-6 text-[11px] font-bold uppercase font-mono tracking-widest transition-all cursor-pointer py-1.5 ${
//                 activeTab === tab
//                   ? "text-white bg-[#f05a28] shadow-sm transform -translate-y-[1px]"
//                   : "text-[#666] hover:bg-white/50"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="flex flex-col w-full flex-1">
//         {renderContent()}
//       </div>
//     </div>
//   );
// }