// import React from "react";
// import StatusCard from "./StatusCard";
// import AvatarCanvas from "./AvatarCanvas";
// import { FaBed, FaRegSmile, FaTint, FaFire } from "react-icons/fa";

// export default function LeftPanel() {
//   const stats = [
//     { icon: <FaBed />, label: "Sleep" },
//     { icon: <FaRegSmile />, label: "Mood" },
//     { icon: <FaTint />, label: "Hydration" },
//     { icon: <FaFire />, label: "Streak" }
//   ];

//   return (
//     <div className="afya-av-col">
//       <div className="afya-av-stage">
//         {/* <AvatarCanvas /> */}
//       </div>
//       <div style={{ display: "flex", gap: 12 }}>
//         <StatusCard stats={stats.slice(0, 2)} label="Daily" />
//         <StatusCard stats={stats.slice(2, 4)} label="Weekly" />
//       </div>
//     </div>
//   );
// }