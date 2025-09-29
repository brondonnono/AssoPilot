export interface Event {
  id: string;
  label: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  members: string[];
  created_at: string;
  updated_at: string;
}


export class EventStore {
  label: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;

  constructor(label: string, description: string, start_date: string, end_date: string, location: string) {
    this.label = label;
    this.description = description;
    this.start_date = start_date;
    this.end_date = end_date;
    this.location = location;
  }
}

