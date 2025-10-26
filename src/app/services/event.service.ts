import { Injectable, inject } from '@angular/core';
import { ElectronService } from './electron.service';
import { Event } from '../core/models/Event';
import { LogService } from './log.service';
import { ActionType, TargetType } from '../core/enums/ActionType.enum';
import { Store } from '@ngrx/store';
import { selectUser } from '../core/state/auth/auth.selector';
import { User } from '../core/models/User';
import { DbUtilityService } from './dbUtilityService';

@Injectable({ providedIn: 'root' })
export class EventService {
  private electron = inject(ElectronService);
  private logService = inject(LogService);
  private readonly dbUtilityService = inject(DbUtilityService);
  private store = inject(Store);
  private currentUser: User | null | undefined = null;

  constructor() {
    this.store.select(selectUser).subscribe((res) => (this.currentUser = res));
  }

  async getAll(): Promise<Event[]> {
    return await this.electron.runQuery('SELECT * FROM events ORDER BY start_date ASC');
  }

  async getUpcomingEvents(limit: number): Promise<Event[]> {
    const query = `SELECT * 
    FROM events 
    WHERE start_date >= ? 
    ORDER BY start_date ASC ${limit ? 'LIMIT ?' : ''}`;

    return await this.electron.runQuery(
      query,
      limit
        ? [this.dbUtilityService.getCurrentDate(), limit]
        : [this.dbUtilityService.getCurrentDate()]
    );
  }

  async add(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) {
    if (this.currentUser) {
      const id = this.dbUtilityService.generateUUID();
      const created_at = this.dbUtilityService.getCurrentDate();
      await this.electron.runQuery(
        `INSERT INTO events (id,label,description,start_date,end_date,location,created_at) VALUES (?,?,?,?,?,?,?)`,
        [
          id,
          event.label,
          event.description,
          event.start_date,
          event.end_date,
          event.location,
          created_at,
        ]
      );
      await this.logService.add(
        ActionType.CREATE.toUpperCase() + '_' + TargetType.EVENT.toUpperCase(),
        this.currentUser.id,
        id
      );
      return id;
    }
    return;
  }

  async update(event: Event) {
    if (this.currentUser) {
      const updated_at = this.dbUtilityService.getCurrentDate();
      await this.electron.runQuery(
        `UPDATE events SET label=?, description=?, start_date=?, end_date=?, location=?, updated_at=? WHERE id=?`,
        [
          event.label,
          event.description,
          event.start_date,
          event.end_date,
          event.location,
          updated_at,
          event.id,
        ]
      );
      await this.logService.add(
        ActionType.EDIT.toUpperCase() + '_' + TargetType.EVENT.toUpperCase(),
        this.currentUser.id,
        event.id
      );
    }
  }

  async delete(id: string) {
    if (this.currentUser) {
      await this.electron.runQuery(`DELETE FROM events WHERE id=?`, [id]);
      await this.logService.add(
        ActionType.DELETE.toUpperCase() + '_' + TargetType.EVENT.toUpperCase(),
        this.currentUser.id,
        id
      );
    }
  }

  async attachMember(eventId: string, memberId: string) {
    if (this.currentUser) {
      await this.electron.runQuery(
        `INSERT OR IGNORE INTO event_members (event_id, member_id) VALUES (?, ?)`,
        [eventId, memberId]
      );
      await this.logService.add(
        ActionType.ATTACH.toUpperCase() +
          '_' +
          TargetType.MEMBER.toUpperCase() +
          '_TO_' +
          TargetType.EVENT.toUpperCase(),
        this.currentUser.id,
        memberId
      );
    }
  }

  async detachMember(eventId: string, memberId: string) {
    if (this.currentUser) {
      await this.electron.runQuery(`DELETE FROM event_members WHERE event_id=? AND member_id=?`, [
        eventId,
        memberId,
      ]);
      await this.logService.add(
        ActionType.DETACH.toUpperCase() +
          '_' +
          TargetType.MEMBER.toUpperCase() +
          '_FROM_' +
          TargetType.EVENT.toUpperCase(),
        this.currentUser.id,
        memberId
      );
    }
  }

  async getMembers(eventId: string) {
    return await this.electron.runQuery(
      `SELECT m.* FROM members m INNER JOIN event_members em ON m.id=em.member_id WHERE em.event_id=?`,
      [eventId]
    );
  }
}
