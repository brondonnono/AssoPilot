export interface Cotisation {
  id: string;
  label: string;
  amount: number;
  frequency: string;
  start_date: string;
  members: string[];
  created_at: string;
  updated_at: string;
}

export class CotisationStore {
  label: string;
  amount: number;
  start_date: string;
  frequency: string;

  constructor(label: string, amount: number, start_date: string, frequency: string) {
    this.label = label;
    this.amount = amount;
    this.start_date = start_date;
    this.frequency = frequency;
  }
}