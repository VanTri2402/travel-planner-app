import React from "react";
import { ItineraryPlan } from "../types"; // Chỉ cần ItineraryPlan
import {
  MapPinIcon,
  FoodIcon,
  LandmarkIcon,
  ActivityIcon,
  BedIcon,
} from "./icons";

interface ItineraryDisplayProps {
  plan: ItineraryPlan; // Chỉ nhận ItineraryPlan
}

// ... (logic parse và ICONS không đổi)
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
  EAT: { component: FoodIcon, color: "bg-emerald-100 text-emerald-700" },
  VISIT: { component: LandmarkIcon, color: "bg-sky-100 text-sky-700" },
  DO: { component: ActivityIcon, color: "bg-amber-100 text-amber-700" },
  STAY: { component: BedIcon, color: "bg-rose-100 text-rose-700" },
  TEXT: { component: () => null, color: "" },
};
const parseItineraryText = (text: string): DayPlan[] => {
  // ... (logic parse không đổi)
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
      {/* **V4.0 RE-SKIN:** text-gray-900, text-gray-600 */}
      <div className="text-left mb-10">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-lexend">
          Your AI-Woven Journey
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Here is your personalized itinerary. Have a wonderful trip!
        </p>
      </div>

      {/* **V4.0 RE-SKIN:** bg-white, border-gray-200, shadow-lg, text-teal-600 */}
      {plan.sources.length > 0 && (
        <div className="mb-10 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg animate-fade-in-up">
          <h4 className="text-2xl font-semibold text-teal-600 mb-4 flex items-center gap-3 font-lexend">
            <MapPinIcon className="w-7 h-7" />
            Locations & Sources
          </h4>
          <p className="text-sm text-gray-500 mb-4">
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
                  className="text-teal-600 hover:text-teal-700 hover:underline transition-colors duration-200 text-sm"
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
            // **V4.0 RE-SKIN:** bg-white, border-gray-200, shadow-2xl
            className="bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl shadow-2xl animate-fade-in-up"
            style={{ animationDelay: `${dayIndex * 150}ms` }}
          >
            {/* **V4.0 RE-SKIN:** text-gray-900 */}
            <h3 className="text-3xl font-bold text-gray-900 mb-6 font-lexend">
              {day.title}
            </h3>
            <div className="space-y-4">
              {day.activities.map((activity, activityIndex) => {
                if (activity.type === "TEXT") {
                  return (
                    // **V4.0 RE-SKIN:** text-gray-700
                    <p
                      key={activityIndex}
                      className="text-gray-700 text-lg leading-relaxed italic"
                    >
                      {activity.description}
                    </p>
                  );
                }
                const IconComponent = ICONS[activity.type].component;
                // **V4.0 RE-SKIN:** Cập nhật màu Icon
                const iconColors = ICONS[activity.type].color.split(" ");
                const iconBg = iconColors[0];
                const iconText = iconColors[1];

                return (
                  <div
                    key={activityIndex}
                    // **V4.0 RE-SKIN:** bg-gray-100 (thay vì 800)
                    className="flex items-start gap-4 p-4 bg-gray-100 rounded-lg animate-fade-in-up"
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
                    {/* **V4.0 RE-SKIN:** text-gray-800 */}
                    <p className="text-gray-800 text-base pt-2">
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
