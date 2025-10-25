import React from "react";
import { ItineraryPlan } from "../types";
import {
  MapPinIcon,
  FoodIcon,
  LandmarkIcon,
  ActivityIcon,
  BedIcon,
} from "./icons";

interface ItineraryDisplayProps {
  plan: ItineraryPlan;
}

type ActivityType = "EAT" | "VISIT" | "DO" | "STAY" | "TEXT";

interface Activity {
  type: ActivityType;
  description: string;
}

interface DayPlan {
  title: string;
  activities: Activity[];
}

const ICONS: Record<
  ActivityType,
  { component: React.FC<{ className?: string }>; color: string }
> = {
  EAT: { component: FoodIcon, color: "bg-emerald-500/20 text-emerald-400" },
  VISIT: { component: LandmarkIcon, color: "bg-sky-500/20 text-sky-400" },
  DO: { component: ActivityIcon, color: "bg-amber-500/20 text-amber-400" },
  STAY: { component: BedIcon, color: "bg-rose-500/20 text-rose-400" },
  TEXT: { component: () => null, color: "" },
};

const parseItineraryText = (text: string): DayPlan[] => {
  const dayPlans: DayPlan[] = [];
  const daySections = text
    .split(/#{2,3}\s*Day\s*\d+/g)
    .filter((section) => section.trim() !== "");
  const dayHeaders = text.match(/#{2,3}\s*Day\s*\d+.*?\n/g) || [];

  daySections.forEach((section, index) => {
    const title = dayHeaders[index]
      ? dayHeaders[index].replace(/#/g, "").trim()
      : `Day ${index + 1}`;
    const lines = section.split("\n").filter((line) => line.trim() !== "");

    const activities: Activity[] = lines.map((line) => {
      const trimmedLine = line.trim().replace(/^\*\s*/, "");
      if (trimmedLine.startsWith("EAT:"))
        return { type: "EAT", description: trimmedLine.substring(4).trim() };
      if (trimmedLine.startsWith("VISIT:"))
        return { type: "VISIT", description: trimmedLine.substring(6).trim() };
      if (trimmedLine.startsWith("DO:"))
        return { type: "DO", description: trimmedLine.substring(3).trim() };
      if (trimmedLine.startsWith("STAY:"))
        return { type: "STAY", description: trimmedLine.substring(5).trim() };
      return { type: "TEXT", description: line };
    });

    dayPlans.push({ title, activities });
  });
  return dayPlans;
};

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ plan }) => {
  const dayPlans = parseItineraryText(plan.itineraryText);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-left mb-10">
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-lexend">
          Your AI-Woven Journey
        </h2>
        <p className="mt-4 text-lg text-gray-400">
          Here is your personalized itinerary. Have a wonderful trip!
        </p>
      </div>

      {plan.sources.length > 0 && (
        <div className="mb-10 bg-gray-900 border border-gray-700/50 rounded-2xl p-6 sm:p-8 shadow-xl animate-fade-in-up">
          <h4 className="text-2xl font-semibold text-teal-400 mb-4 flex items-center gap-3 font-lexend">
            <MapPinIcon className="w-7 h-7" />
            Locations & Sources
          </h4>
          <p className="text-sm text-gray-400 mb-4">
            These locations from Google Maps were used to help generate your
            itinerary.
          </p>
          <ul className="space-y-2 columns-1 sm:columns-2">
            {plan.sources.map((source, index) => (
              <li key={index}>
                <a
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-400 hover:text-teal-300 hover:underline transition-colors duration-200 text-sm"
                >
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-12">
        {dayPlans.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className="bg-gray-900 border border-gray-700/50 p-6 sm:p-8 rounded-2xl shadow-2xl animate-fade-in-up"
            style={{ animationDelay: `${dayIndex * 150}ms` }}
          >
            <h3 className="text-3xl font-bold text-white mb-6 font-lexend">
              {day.title}
            </h3>
            <div className="space-y-4">
              {day.activities.map((activity, activityIndex) => {
                if (activity.type === "TEXT") {
                  return (
                    <p
                      key={activityIndex}
                      className="text-gray-300 text-lg leading-relaxed italic"
                    >
                      {activity.description}
                    </p>
                  );
                }
                const IconComponent = ICONS[activity.type].component;
                const iconColors = ICONS[activity.type].color.split(" ");
                const iconBg = iconColors[0];
                const iconText = iconColors[1];

                return (
                  <div
                    key={activityIndex}
                    className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg animate-fade-in-up"
                    style={{
                      animationDelay: `${
                        dayIndex * 150 + (activityIndex + 1) * 75
                      }ms`,
                    }}
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}
                    >
                      <IconComponent className={`w-5 h-5 ${iconText}`} />
                    </div>
                    <p className="text-gray-200 text-base pt-2">
                      {activity.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryDisplay;
