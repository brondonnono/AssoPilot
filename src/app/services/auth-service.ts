import { inject, Injectable } from '@angular/core';
import { User } from '../core/models/User';
import { MockDataService } from './MockData.service';
import { ElectronService } from './electron.service';

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: { id: string; username: string; role: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private mockDataService = inject(MockDataService);
  private electronService = inject(ElectronService);

  private currentUser: User | null = null;

  async login(username: string, password: string): Promise<AuthResponse> {
    if (!this.electronService.isElectron) {
      return { success: false, message: 'Login uniquement disponible en mode desktop' };
    }
    return await this.electronService.runQuery('login', [username, password]);
  }

  logout() {
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}
