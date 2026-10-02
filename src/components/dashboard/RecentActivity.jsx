import React from 'react';
import { Clock, Upload, Sparkles, SquarePen, CheckCircle2 } from 'lucide-react';

const activities = [
  {
    id: 1,
    icon: Sparkles,
    desc: 'Generated a new script for "Tech Review 2024"',
    time: '2 hours ago',
    iconColor: 'text-brand-600',
    iconBg: 'bg-brand-50'
  },
  {
    id: 2,
    icon: SquarePen,
    desc: 'Reviewed and refined "Product Launch Intro"',
    time: '4 hours ago',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50'
  },
  {
    id: 3,
    icon: CheckCircle2,
    desc: 'Approved final draft for "Vlog Ep 12"',
    time: 'Yesterday',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50'
  },
  {
    id: 4,
    icon: Upload,
    desc: 'Uploaded new reference video to Style Profile',
    time: '2 days ago',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50'
  }
];

const RecentActivity = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center gap-2">
        <Clock className="text-gray-400" size={20} />
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
      </div>
      
      <div className="divide-y divide-gray-100">
        {activities.map((item) => (
          <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors duration-150 flex items-center gap-4">
            <div className={`p-2 rounded-lg ${item.iconBg} ${item.iconColor}`}>
              <item.icon size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{item.desc}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
