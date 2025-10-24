import { Injectable, inject } from '@angular/core';
import { ElectronService } from './electron.service';
import { Cotisation } from '../core/models/Cotisation';
import { Store } from '@ngrx/store';
import { User } from '../core/models/User';
import { LogService } from './log.service';
import { selectUser } from '../core/state/auth/auth.selector';
import { ActionType, TargetType } from '../core/enums/ActionType.enum';

@Injectable({ providedIn: 'root' })
export class CotisationService {
  private electron = inject(ElectronService);
  private logService = inject(LogService);
  private store = inject(Store);
  private currentUser: User | null | undefined = null;

  constructor() {
    this.store.select(selectUser).subscribe((res) => (this.currentUser = res));
  }

  async getAll(): Promise<Cotisation[]> {
    return await this.electron.runQuery('SELECT * FROM cotisations');
  }

  async add(c: Omit<Cotisation, 'id' | 'created_at' | 'updated_at'>) {
    if (this.currentUser) {
      const id = crypto.randomUUID();
      const created_at = new Date().toISOString();
      await this.electron.runQuery(
        `INSERT INTO cotisations (id,title,amount,frequency,start_date,created_at) VALUES (?,?,?,?,?,?)`,
        [id, c.title, c.amount, c.frequency, c.start_date, created_at]
      );

      await this.logService.add(
        ActionType.CREATE.toUpperCase() + '_' + TargetType.COTISATION.toUpperCase(),
        this.currentUser.id,
        id
      );
      return id;
    }
    return;
  }

  async update(c: Cotisation) {
    if (this.currentUser) {
      const updated_at = new Date().toISOString();
      await this.electron.runQuery(
        `UPDATE cotisations SET title=?, amount=?, frequency=?, start_date=?, updated_at=? WHERE id=?`,
        [c.title, c.amount, c.frequency, c.start_date, updated_at, c.id]
      );

      await this.logService.add(
        ActionType.EDIT.toUpperCase() + '_' + TargetType.COTISATION.toUpperCase(),
        this.currentUser.id,
        c.id
      );
    }
  }

  async delete(id: string) {
    if (this.currentUser) {
      await this.electron.runQuery(`DELETE FROM cotisations WHERE id=?`, [id]);
      await this.logService.add(
        ActionType.DELETE.toUpperCase() + '_' + TargetType.COTISATION.toUpperCase(),
        this.currentUser.id,
        id
      );
    }
  }

  async attachMember(cotisationId: string, memberId: string) {
    if (this.currentUser) {
      await this.electron.runQuery(
        `INSERT OR IGNORE INTO cotisation_members (cotisation_id, member_id) VALUES (?, ?)`,
        [cotisationId, memberId]
      );
      await this.logService.add(
        ActionType.ATTACH.toUpperCase() +
          '_' +
          TargetType.MEMBER.toUpperCase() +
          '_TO_' +
          TargetType.COTISATION.toUpperCase(),
        this.currentUser.id,
        memberId
      );
    }
  }

  async detachMember(cotisationId: string, memberId: string) {
    if (this.currentUser) {
      await this.electron.runQuery(
        `DELETE FROM cotisation_members WHERE cotisation_id=? AND member_id=?`,
        [cotisationId, memberId]
      );
      await this.logService.add(
        ActionType.DETACH.toUpperCase() +
          '_' +
          TargetType.MEMBER.toUpperCase() +
          '_TO_' +
          TargetType.COTISATION.toUpperCase(),
        this.currentUser.id,
        memberId
      );
    }
  }

  async getMembers(cotisationId: string) {
    return await this.electron.runQuery(
      `SELECT m.* FROM members m INNER JOIN cotisation_members cm ON m.id=cm.member_id WHERE cm.cotisation_id=?`,
      [cotisationId]
    );
  }
}
