import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActionType, TargetType } from '../core/enums/ActionType.enum';
import { User } from '../core/models/User';
import { selectUser } from '../core/state/auth/auth.selector';
import { ElectronService } from './electron.service';
import { LogService } from './log.service';
import * as bcrypt from 'bcryptjs';
import { DbUtilityService } from './DbUtilityService';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private electron = inject(ElectronService);
  private logService = inject(LogService);
  private readonly dbUtilityService = inject(DbUtilityService);
  private store = inject(Store);
  private currentUser: User | null | undefined = null;

  constructor() {
    this.store.select(selectUser).subscribe((res) => {
      this.currentUser = res;
      console.log(res);
    });
  }

  async getAll(): Promise<User[]> {
    try {
      return await this.electron.runQuery('SELECT * FROM users WHERE role <> ?', ['root']);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Could not fetch users');
    }
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async add(user: Omit<User, 'id' | 'created_at'>) {
    if (!this.currentUser) {
      try {
        // Vérification de l'existence du username (indexée pour performance)
        const existingUser = await this.electron.runQuery(
          'SELECT id FROM users WHERE LOWER(TRIM(username)) = LOWER(TRIM(?)) LIMIT 1',
          [user.username]
        );

        if (existingUser && existingUser.length > 0) {
          throw new Error('Username already taken');
        }

        const id = this.dbUtilityService.generateUUID();
        const created_at = this.dbUtilityService.getCurrentDate();
        const hashedPassword = await this.hashPassword(user.password);
        await this.electron.runQuery(
          `INSERT INTO users (id, username, password, role, created_at) VALUES (?, ?, ?, ?, ?)`,
          [id, user.username, hashedPassword, user.role, created_at]
        );
        await this.logService.add(
          `${ActionType.CREATE.toUpperCase()}_${TargetType.USER.toUpperCase()}`,
          'test123',
          id
        );
      } catch (error) {
        console.error('Error adding user:', error);
        throw new Error('Could not add user');
      }
    }
  }

  async update(user: User) {
    if (this.currentUser) {
      try {
        await this.electron.runQuery(`UPDATE users SET username=?, password=? WHERE id=?`, [
          user.username,
          user.password,
          user.id,
        ]);
        await this.logService.add(
          `${ActionType.EDIT.toUpperCase()}_${TargetType.USER.toUpperCase()}`,
          this.currentUser.id,
          user.id
        );
      } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Could not update user');
      }
    }
  }

  async delete(id: string) {
    if (this.currentUser) {
      try {
        await this.electron.runQuery(`DELETE FROM users WHERE id=?`, [id]);
        await this.logService.add(
          `${ActionType.DELETE.toUpperCase()}_${TargetType.USER.toUpperCase()}`,
          this.currentUser.id,
          id
        );
      } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Could not delete user');
      }
    }
  }
}
