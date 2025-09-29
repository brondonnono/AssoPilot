import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cotisation } from '../models/Cotisation';
import { Observable } from 'rxjs';
import { Member } from '../models/Member';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  constructor(private http: HttpClient) { }

  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>('assets/mock/members.json');
  }

  getCotisations(): Observable<Cotisation[]> {
    return this.http.get<Cotisation[]>('assets/mock/cotisations.json');
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>('assets/mock/events.json');
  }
}
