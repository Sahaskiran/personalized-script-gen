import React from 'react';

const colorMap = {
  brand: {
    bg: 'bg-brand-50',
    text: 'text-brand-600',
    change: 'text-brand-600'
  },
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    change: 'text-emerald-600'
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    change: 'text-amber-600'
  }
};

const StatCard = ({ icon: Icon, label, value, change, color }) => {
  const colors = colorMap[color] || colorMap.brand;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
      <div className={`p-4 rounded-xl ${colors.bg} ${colors.text}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          <span className={`text-xs font-medium ${colors.change}`}>{change}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
