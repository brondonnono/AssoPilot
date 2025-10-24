import { Injectable, inject } from '@angular/core';
import { ElectronService } from './electron.service';
import { Member } from '../core/models/Member';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private electron = inject(ElectronService);

  async getAll(): Promise<Member[]> {
    return await this.electron.runQuery('SELECT * FROM members');
  }

  async add(member: Omit<Member, 'id' | 'created_at' | 'updated_at'>) {
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
  }

  async update(member: Member) {
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
  }

  async delete(id: string) {
    await this.electron.runQuery(`DELETE FROM members WHERE id=?`, [id]);
  }
}
