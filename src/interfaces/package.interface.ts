export interface Package {
  id: string;
  userId: string;
  packageName: string;
  quota: number;
  price: number;
  status: string;
  startDate: string; // ISO string dari BE
  endDate: string;
}
