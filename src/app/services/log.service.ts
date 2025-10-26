import { inject, Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { Log } from '../core/models/Log';
import { DbUtilityService } from './DbUtilityService';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  private electron = inject(ElectronService);
  private readonly dbUtilityService = inject(DbUtilityService);

  async getAll(): Promise<Log[]> {
    return await this.electron.runQuery('SELECT * FROM logs');
  }

  async add(action: string, currentUser_id: string, target_id: string) {
    const id = this.dbUtilityService.generateUUID();
    const created_at = this.dbUtilityService.getCurrentDate();
    await this.electron.runQuery(
      `INSERT INTO logs (id, action, user_id, target_id, created_at) VALUES (?,?,?,?,?)`,
      [id, action, currentUser_id, target_id, created_at]
    );
  }
}
