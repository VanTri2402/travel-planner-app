
import React from 'react';
import { ItineraryPlan } from '../types';
import { MapPinIcon, FoodIcon, LandmarkIcon, ActivityIcon, BedIcon } from './icons';

interface ItineraryDisplayProps {
  plan: ItineraryPlan;
}

type ActivityType = 'EAT' | 'VISIT' | 'DO' | 'STAY' | 'TEXT';

interface Activity {
    type: ActivityType;
    description: string;
}

interface DayPlan {
    title: string;
    activities: Activity[];
}

const ICONS: Record<ActivityType, { component: React.FC<{ className?: string }>, color: string }> = {
    'EAT': { component: FoodIcon, color: 'bg-emerald-500/20 text-emerald-300' },
    'VISIT': { component: LandmarkIcon, color: 'bg-sky-500/20 text-sky-300' },
    'DO': { component: ActivityIcon, color: 'bg-amber-500/20 text-amber-300' },
    'STAY': { component: BedIcon, color: 'bg-rose-500/20 text-rose-300' },
    'TEXT': { component: () => null, color: '' },
};

const parseItineraryText = (text: string): DayPlan[] => {
    const dayPlans: DayPlan[] = [];
    const daySections = text.split(/#{2,3}\s*Day\s*\d+/g).filter(section => section.trim() !== '');
    const dayHeaders = text.match(/#{2,3}\s*Day\s*\d+.*?\n/g) || [];

    daySections.forEach((section, index) => {
        const title = dayHeaders[index] ? dayHeaders[index].replace(/#/g, '').trim() : `Day ${index + 1}`;
        const lines = section.split('\n').filter(line => line.trim() !== '');
        
        const activities: Activity[] = lines.map(line => {
            const trimmedLine = line.trim().replace(/^\*\s*/, '');
            if (trimmedLine.startsWith('EAT:')) return { type: 'EAT', description: trimmedLine.substring(4).trim() };
            if (trimmedLine.startsWith('VISIT:')) return { type: 'VISIT', description: trimmedLine.substring(6).trim() };
            if (trimmedLine.startsWith('DO:')) return { type: 'DO', description: trimmedLine.substring(3).trim() };
            if (trimmedLine.startsWith('STAY:')) return { type: 'STAY', description: trimmedLine.substring(5).trim() };
            return { type: 'TEXT', description: line };
        });

        dayPlans.push({ title, activities });
    });
    return dayPlans;
};

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ plan }) => {
  const dayPlans = parseItineraryText(plan.itineraryText);

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-lexend">Your AI-Woven Journey</h2>
            <p className="mt-4 text-lg text-gray-400">Here is your personalized itinerary. Have a wonderful trip!</p>
        </div>

        <div className="space-y-12">
            {dayPlans.map((day, dayIndex) => (
                <div key={dayIndex} className="glass-card p-6 sm:p-8 rounded-2xl shadow-2xl animate-fade-in-up" style={{ animationDelay: `${dayIndex * 150}ms` }}>
                    <h3 className="text-3xl font-bold text-indigo-400 mb-6 font-lexend">{day.title}</h3>
                    <div className="relative pl-8 border-l-2 border-gray-700/50">
                        {day.activities.map((activity, activityIndex) => {
                            if (activity.type === 'TEXT') {
                                return (
                                     <p key={activityIndex} className="text-gray-300 mb-4 italic">
                                        {activity.description}
                                    </p>
                                );
                            }
                            const IconComponent = ICONS[activity.type].component;
                            const iconColor = ICONS[activity.type].color;
                            return (
                                <div key={activityIndex} className="mb-6 relative animate-fade-in-up" style={{ animationDelay: `${dayIndex * 150 + (activityIndex + 1) * 75}ms` }}>
                                    <div className={`absolute -left-[42px] top-0 w-10 h-10 rounded-full flex items-center justify-center ${iconColor}`}>
                                        <IconComponent className="w-5 h-5" />
                                    </div>
                                    <p className="text-gray-200 text-base">{activity.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
      
      {plan.sources.length > 0 && (
        <div className="mt-12 glass-card p-6 sm:p-8 rounded-2xl shadow-2xl animate-fade-in-up" style={{ animationDelay: `${dayPlans.length * 150}ms` }}>
          <h4 className="text-2xl font-semibold text-indigo-400 mb-4 flex items-center gap-3 font-lexend">
            <MapPinIcon className="w-7 h-7" />
            Locations & Sources
          </h4>
          <p className="text-sm text-gray-400 mb-4">
            These locations from Google Maps were used to help generate your itinerary.
          </p>
          <ul className="space-y-2 columns-1 sm:columns-2">
            {plan.sources.map((source, index) => (
              <li key={index}>
                <a
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors duration-200 text-sm"
                >
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ItineraryDisplay;
