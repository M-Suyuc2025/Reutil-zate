export interface PointsActivity {
  type: "earn" | "redeem";
  label: string;
  points: number;
  createdAt: string;
}

export interface PointsSummary {
  totalPoints: number;
  activities: PointsActivity[];
}