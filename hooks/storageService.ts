import { useState, useEffect, useCallback } from "react";
import { SavedItinerary, GeneratedPlan } from "../types";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

/**
 * **V6.0 MỚI:** Hook này thay thế 'storageService.ts' cũ.
 * Nó quản lý toàn bộ logic CRUD cho localStorage,
 * và tự động phân vùng (scope) dữ liệu theo 'userId' lấy từ Kinde.
 */
export const useStorage = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useKindeAuth();
  const [userId, setUserId] = useState<string | null>(null);

  // Trạng thái cho dữ liệu
  const [plans, setPlans] = useState<SavedItinerary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hàm lấy STORAGE_KEY theo user
  const getStorageKey = useCallback(
    (id: string) => `aiJourneyWeaverHistory_${id}`,
    []
  );

  // 1. Cập nhật userId khi Kinde tải xong
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && user) {
      setUserId(user.id);
    } else if (!isAuthLoading && !isAuthenticated) {
      setUserId(null);
      setPlans([]); // Xóa dữ liệu nếu đăng xuất
    }
  }, [user, isAuthenticated, isAuthLoading]);

  // 2. Tải dữ liệu từ localStorage khi userId thay đổi (đăng nhập)
  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      try {
        const rawData = localStorage.getItem(getStorageKey(userId));
        if (rawData) {
          const parsedPlans: SavedItinerary[] = JSON.parse(rawData);
          setPlans(
            parsedPlans.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
          );
        } else {
          setPlans([]);
        }
      } catch (error) {
        console.error("Failed to parse user plans from localStorage", error);
        setPlans([]);
      }
      setIsLoading(false);
    } else if (!isAuthLoading) {
      // Đã tải xong auth nhưng không có user
      setIsLoading(false);
      setPlans([]);
    }
  }, [userId, getStorageKey, isAuthLoading]);

  // Hàm trợ giúp để lưu vào state và localStorage
  const _commit = (newPlans: SavedItinerary[]) => {
    if (userId) {
      setPlans(newPlans);
      localStorage.setItem(getStorageKey(userId), JSON.stringify(newPlans));
    }
  };

  // 3. Các hàm CRUD
  const saveItinerary = (
    destination: string,
    duration: number,
    interests: string,
    generatedPlan: GeneratedPlan
  ): SavedItinerary | null => {
    if (!userId) return null;

    const newSavedItinerary: SavedItinerary = {
      id: crypto.randomUUID(),
      destination,
      duration,
      interests,
      generatedPlan,
      createdAt: new Date().toISOString(),
      notes: "",
      heroImageURL: null,
      mapImageURL: null,
    };

    const updatedPlans = [newSavedItinerary, ...plans];
    _commit(updatedPlans);
    return newSavedItinerary;
  };

  const deleteItinerary = (id: string) => {
    if (!userId) return;

    const updatedPlans = plans.filter((plan) => plan.id !== id);
    _commit(updatedPlans);
  };

  const updateNotes = (id: string, notes: string) => {
    if (!userId) return;

    const updatedPlans = plans.map((plan) =>
      plan.id === id ? { ...plan, notes: notes } : plan
    );
    _commit(updatedPlans);
  };

  const updateGeneratedImageURLs = (
    id: string,
    heroURL: string,
    mapURL: string
  ) => {
    if (!userId) return;

    const updatedPlans = plans.map((plan) =>
      plan.id === id
        ? { ...plan, heroImageURL: heroURL, mapImageURL: mapURL }
        : plan
    );
    _commit(updatedPlans);
  };

  const getItineraryById = (id: string): SavedItinerary | null => {
    return plans.find((plan) => plan.id === id) || null;
  };

  // 4. Trả về API cho các component
  return {
    plans,
    isLoading: isLoading || isAuthLoading, // Loading nếu auth hoặc storage đang tải
    getItineraryById,
    saveItinerary,
    deleteItinerary,
    updateNotes,
    updateGeneratedImageURLs,
    isAuthenticated, // Tiện ích
    user, // Tiện ích
  };
};
