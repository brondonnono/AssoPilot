import { Injectable, inject } from '@angular/core';
import { ElectronService } from './electron.service';
import { Cotisation } from '../core/models/Cotisation';

@Injectable({ providedIn: 'root' })
export class CotisationService {
  private electron = inject(ElectronService);

  async getAll(): Promise<Cotisation[]> {
    return await this.electron.runQuery('SELECT * FROM cotisations');
  }

  async add(c: Omit<Cotisation, 'id' | 'created_at' | 'updated_at'>) {
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    await this.electron.runQuery(
      `INSERT INTO cotisations (id,title,amount,frequency,start_date,created_at) VALUES (?,?,?,?,?,?)`,
      [id, c.title, c.amount, c.frequency, c.start_date, created_at]
    );
    return id;
  }

  async update(c: Cotisation) {
    const updated_at = new Date().toISOString();
    await this.electron.runQuery(
      `UPDATE cotisations SET title=?, amount=?, frequency=?, start_date=?, updated_at=? WHERE id=?`,
      [c.title, c.amount, c.frequency, c.start_date, updated_at, c.id]
    );
  }

  async delete(id: string) {
    await this.electron.runQuery(`DELETE FROM cotisations WHERE id=?`, [id]);
  }

  async attachMember(cotisationId: string, memberId: string) {
    await this.electron.runQuery(
      `INSERT OR IGNORE INTO cotisation_members (cotisation_id, member_id) VALUES (?, ?)`,
      [cotisationId, memberId]
    );
  }

  async detachMember(cotisationId: string, memberId: string) {
    await this.electron.runQuery(
      `DELETE FROM cotisation_members WHERE cotisation_id=? AND member_id=?`,
      [cotisationId, memberId]
    );
  }

  async getMembers(cotisationId: string) {
    return await this.electron.runQuery(
      `SELECT m.* FROM members m INNER JOIN cotisation_members cm ON m.id=cm.member_id WHERE cm.cotisation_id=?`,
      [cotisationId]
    );
  }
}
