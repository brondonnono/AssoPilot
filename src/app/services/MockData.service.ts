import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cotisation } from '../core/models/Cotisation';
import { Observable } from 'rxjs';
import { Member } from '../core/models/Member';
import { User } from '../core/models/User';
import { Event } from '../core/models/Event';
import { Log } from '../core/models/Log';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  constructor(private http: HttpClient) {}

  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>('assets/mock/members.json');
  }

  getCotisations(): Observable<Cotisation[]> {
    return this.http.get<Cotisation[]>('assets/mock/cotisations.json');
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>('assets/mock/events.json');
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('assets/mock/users.json');
  }

  getLogs(): Observable<Log[]> {
    return this.http.get<Log[]>('assets/mock/logs.json');
  }

  getUpcomingEvents(events: Event[]): Event[] {
    let upcomingEvents: Event[] = [];
    const today = new Date();
    events.forEach((_event) => {
      const startEventDate = new Date(_event.start_date);
      if (today < startEventDate) upcomingEvents.push(_event);
    });
    return upcomingEvents;
  }
}
