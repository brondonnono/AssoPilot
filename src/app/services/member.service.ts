import { Injectable, inject } from '@angular/core';
import { ElectronService } from './electron.service';
import { Member } from '../core/models/Member';
import { Store } from '@ngrx/store';
import { User } from '../core/models/User';
import { selectUser } from '../core/state/auth/auth.selector';
import { LogService } from './log.service';
import { ActionType, TargetType } from '../core/enums/ActionType.enum';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private electron = inject(ElectronService);
  private logService = inject(LogService);
  private store = inject(Store);
  private currentUser: User | null | undefined = null;

  constructor() {
    this.store.select(selectUser).subscribe((res) => (this.currentUser = res));
  }

  async getAll(): Promise<Member[]> {
    return await this.electron.runQuery('SELECT * FROM members');
  }

  async add(member: Omit<Member, 'id' | 'created_at' | 'updated_at'>) {
    if (this.currentUser) {
      const id = crypto.randomUUID();
      const created_at = new Date().toISOString();
      await this.electron.runQuery(
        `INSERT INTO members (id,name,phone,cni,status,joined_date,created_at,updated_at) VALUES (?,?,?,?,?,?,?)`,
        [
          id,
          member.name,
          member.phone,
          member.cni,
          member.status,
          member.joined_date,
          created_at,
          created_at,
        ]
      );
      await this.logService.add(
        ActionType.CREATE.toUpperCase() + '_' + TargetType.MEMBER.toUpperCase(),
        this.currentUser.id,
        id
      );
    }
  }

  async update(member: Member) {
    if (this.currentUser) {
      const updated_at = new Date().toISOString();
      await this.electron.runQuery(
        `UPDATE members SET name=?, phone=?, cni=?, status=?, joined_date=?, updated_at=? WHERE id=?`,
        [
          member.name,
          member.phone,
          member.cni,
          member.status,
          member.joined_date,
          updated_at,
          member.id,
        ]
      );
      await this.logService.add(
        ActionType.EDIT.toUpperCase() + '_' + TargetType.MEMBER.toUpperCase(),
        this.currentUser.id,
        member.id
      );
    }
  }

  async delete(id: string) {
    if (this.currentUser) {
      await this.electron.runQuery(`DELETE FROM members WHERE id=?`, [id]);
      await this.logService.add(
        ActionType.DELETE.toUpperCase() + '_' + TargetType.MEMBER.toUpperCase(),
        this.currentUser.id,
        id
      );
    }
  }
}
