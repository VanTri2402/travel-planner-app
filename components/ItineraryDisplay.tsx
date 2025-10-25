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
  EAT: { component: FoodIcon, color: "bg-emerald-100 text-emerald-700" },
  VISIT: { component: LandmarkIcon, color: "bg-sky-100 text-sky-700" },
  DO: { component: ActivityIcon, color: "bg-amber-100 text-amber-700" },
  STAY: { component: BedIcon, color: "bg-rose-100 text-rose-700" },
  TEXT: { component: () => null, color: "" },
};

/**
 * **V6.2 FIX:** Cập nhật logic parse để làm sạch triệt để hơn.
 */
const parseItineraryText = (text: string): DayPlan[] => {
  const dayPlans: DayPlan[] = [];
  // Tách bằng lookahead để giữ delimiter
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
        // **V6.2:** Làm sạch kỹ hơn
        let cleanedLine = line
          .trim()
          .replace(/^\*\s*/, "") // Bỏ dấu * đầu dòng
          .replace(/\*\*/g, "") // Bỏ markdown đậm (**)
          .replace(/\[\d+(?:,\s*\d+)*\]/g, "") // Bỏ [0, 1,...] hoặc [1]
          .replace(/\\n/g, " ") // Thay \n bằng khoảng trắng
          .replace(/\s{2,}/g, " ") // Thay nhiều khoảng trắng bằng 1
          .trim(); // Trim lại lần cuối

        // Xác định loại activity
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

        // Chỉ trả về TEXT nếu cleanedLine không rỗng
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
  // **V6.2:** Xử lý trường hợp itineraryText bắt đầu bằng Error
  if (plan.itineraryText.trim().startsWith("**Error:**")) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-red-100 border border-red-300 rounded-lg text-red-800">
        <h3 className="font-bold font-lexend text-xl mb-2">
          Itinerary Generation Error
        </h3>
        {/* Dùng whitespace-pre-wrap để hiển thị lỗi nhiều dòng */}
        <p className="whitespace-pre-wrap">
          {plan.itineraryText.replace("**Error:**", "").trim()}
        </p>
      </div>
    );
  }

  const dayPlans = parseItineraryText(plan.itineraryText);

  // Nếu parsing không ra kết quả nào (dù không có lỗi rõ ràng)
  if (dayPlans.length === 0 && plan.itineraryText) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800">
        <h3 className="font-bold font-lexend text-xl mb-2">
          Itinerary Parsing Issue
        </h3>
        <p>
          Could not properly parse the generated itinerary text. Displaying raw
          content:
        </p>
        <pre className="mt-2 text-sm whitespace-pre-wrap bg-gray-100 p-2 rounded">
          {plan.itineraryText}
        </pre>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* ... (Tiêu đề, Card Nguồn giữ nguyên) ... */}
      <div className="text-left mb-10">...</div>
      {plan.sources && plan.sources.length > 0 && (
        <div className="mb-10 ...">...</div>
      )}

      {/* Lịch trình theo ngày */}
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
                    // **V6.1:** Đảm bảo có whitespace-pre-wrap
                    <p
                      key={activityIndex}
                      className="text-gray-700 text-lg leading-relaxed italic whitespace-pre-wrap"
                    >
                      {activity.description}
                    </p>
                  );
                }
                const IconComponent = ICONS[activity.type].component;
                const iconColors = ICONS[activity.type].color;

                return (
                  <div
                    key={activityIndex}
                    className={`flex items-start gap-4 p-4 ${
                      activity.type !== "TEXT" ? "bg-gray-100" : ""
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
