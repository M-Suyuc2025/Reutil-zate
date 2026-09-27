export interface Reward {
  id: number;
  name: string;
  description: string | null;
  costPoints: number;
  monthlyLimit: number | null;
  totalLimit: number | null;
  isActive: boolean;
}