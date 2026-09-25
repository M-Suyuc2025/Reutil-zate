export interface HistoryRecord {
  id: number;
  material: string;
  pointsEarned: number;
  createdAt: string;
}

export interface HistoryResponse {
  records: HistoryRecord[];
}