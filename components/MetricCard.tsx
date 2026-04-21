import React from 'react';

const MetricCard = ({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
  <div className="p-5 border border-slate-100 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-2 mb-3">
      <div className={`p-2 rounded-xl bg-slate-50 ${color}`}>{icon}</div>
      <span className="text-[10px] font-black text-slate-400 tracking-tighter uppercase">{label}</span>
    </div>
    <div className="text-xl font-black text-slate-800 tabular-nums">{value}</div>
  </div>
);

export default MetricCard;
