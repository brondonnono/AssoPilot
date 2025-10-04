export interface Cotisation {
  id: string;
  title: string;
  amount: number;
  frequency: string;
  start_date: string;
  members: string[];
  created_at: string;
  updated_at: string;
}

export class CotisationStore {
  title: string;
  amount: number;
  start_date: string;
  frequency: string;

  constructor(title: string, amount: number, start_date: string, frequency: string) {
    this.title = title;
    this.amount = amount;
    this.start_date = start_date;
    this.frequency = frequency;
  }
}
