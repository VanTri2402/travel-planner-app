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

// **FIXED:** Chỉ còn màu cho Light Mode
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

// Hàm parse giữ nguyên từ v6.1
const parseItineraryText = (text: string): DayPlan[] => {
  const dayPlans: DayPlan[] = [];
  const daySections = text
    .split(/(?=#{2,3}\s*Day\s*\d+)/g)
    .filter((section) => section.trim() !== "");

  daySections.forEach((section, index) => {
    const lines = section.split("\n").filter((line) => line.trim() !== "");
    const title = lines[0]
      ? lines[0].replace(/#/g, "").trim()
      : `Day ${index + 1}`;

    const activities: Activity[] = lines
      .slice(1)
      .map((line) => {
        let cleanedLine = line
          .trim()
          .replace(/^\*\s*/, "")
          .replace(/\*\*/g, "");
        cleanedLine = cleanedLine.replace(/\[\d+\]/g, "").trim();

        if (cleanedLine.startsWith("EAT:"))
          return { type: "EAT", description: cleanedLine.substring(4).trim() };
        if (cleanedLine.startsWith("VISIT:"))
          return {
            type: "VISIT",
            description: cleanedLine.substring(6).trim(),
          };
        if (cleanedLine.startsWith("DO:"))
          return { type: "DO", description: cleanedLine.substring(3).trim() };
        if (cleanedLine.startsWith("STAY:"))
          return { type: "STAY", description: cleanedLine.substring(5).trim() };

        return cleanedLine ? { type: "TEXT", description: cleanedLine } : null;
      })
      .filter(
        (activity) => activity !== null && activity.description
      ) as Activity[];

    if (activities.length > 0) {
      dayPlans.push({ title, activities });
    }
  });
  return dayPlans;
};

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ plan }) => {
  const dayPlans = parseItineraryText(plan.itineraryText);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tiêu đề & Mô tả (Chỉ Light) */}
      <div className="text-left mb-10">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-lexend">
          Your AI-Woven Journey
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Here is your personalized itinerary. Have a wonderful trip!
        </p>
      </div>

      {/* Card Nguồn (Chỉ Light) */}
      {plan.sources && plan.sources.length > 0 && (
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

      {/* Lịch trình theo ngày (Chỉ Light) */}
      <div className="space-y-12">
        {dayPlans.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className="bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl shadow-xl animate-fade-in-up"
            style={{ animationDelay: `${dayIndex * 150}ms` }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6 font-lexend">
              {day.title}
            </h3>
            <div className="space-y-4">
              {day.activities.map((activity, activityIndex) => {
                if (activity.type === "TEXT") {
                  return (
                    <p
                      key={activityIndex}
                      className="text-gray-700 text-lg leading-relaxed italic whitespace-pre-wrap"
                    >
                      {activity.description}
                    </p>
                  );
                }
                const IconComponent = ICONS[activity.type].component;
                // Chỉ dùng màu Light Mode
                const iconColors = ICONS[activity.type].color
                  .split(" ")
                  .filter((c) => !c.startsWith("dark:"))
                  .join(" ");

                return (
                  <div
                    key={activityIndex}
                    className={`flex items-start gap-4 p-4 ${
                      activity?.type !== "TEXT" ? "bg-gray-100" : ""
                    } rounded-lg animate-fade-in-up`}
                    style={{
                      animationDelay: `${
                        dayIndex * 150 + (activityIndex + 1) * 75
                      }ms`,
                    }}
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconColors}`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
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
