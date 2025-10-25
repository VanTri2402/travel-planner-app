
export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface ItineraryPlan {
  itineraryText: string;
  sources: GroundingSource[];
}
