/* eslint-disable @typescript-eslint/no-require-imports */
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActionType, TargetType } from '../core/enums/ActionType.enum';
import { Member } from '../core/models/Member';
import { User } from '../core/models/User';
import { selectUser } from '../core/state/auth/auth.selector';
import { ElectronService } from './electron.service';
import { LogService } from './log.service';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private electron = inject(ElectronService);
  private logService = inject(LogService);
  private store = inject(Store);
  private currentUser: User | null | undefined = null;

  constructor() {
    this.store.select(selectUser).subscribe((res) => (this.currentUser = res));
  }

  async getAll(): Promise<Member[]> {
    return await this.electron.runQuery('SELECT * FROM users');
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async add(user: Omit<User, 'id' | 'created_at'>) {
    if (this.currentUser) {
      const id = crypto.randomUUID();
      const created_at = new Date().toISOString();
      const hashedPassword = await this.hashPassword(user.password);
      await this.electron.runQuery(
        `INSERT INTO users (id,username,password,created_at) VALUES (?,?,?,?)`,
        [id, user.username, hashedPassword, created_at]
      );
      await this.logService.add(
        ActionType.CREATE.toUpperCase() + '_' + TargetType.USER.toUpperCase(),
        this.currentUser.id,
        id
      );
    }
  }

  async update(user: User) {
    if (this.currentUser) {
      await this.electron.runQuery(`UPDATE users SET username=?, password=? WHERE id=?`, [
        user.username,
        user.password,
        user.id,
      ]);
      await this.logService.add(
        ActionType.EDIT.toUpperCase() + '_' + TargetType.USER.toUpperCase(),
        this.currentUser.id,
        user.id
      );
    }
  }

  async delete(id: string) {
    if (this.currentUser) {
      await this.electron.runQuery(`DELETE FROM users WHERE id=?`, [id]);
      await this.logService.add(
        ActionType.DELETE.toUpperCase() + '_' + TargetType.USER.toUpperCase(),
        this.currentUser.id,
        id
      );
    }
  }
}
