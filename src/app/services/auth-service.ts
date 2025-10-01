import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { User } from '../core/models/User';
import { MockDataService } from './MockData.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private mockDataService: MockDataService) { }
  private currentUser: User | null = null;

  login(username: string, password: string) {
    // replace by sqlite login code
    let user: User | undefined;
    this.mockDataService.getUsers().subscribe({
      next: (users: User[]) => {
        user = users.find(
          (u) => u.username === username && u.password === password
        );
      },
      error: (error) => {
        return throwError(() => new Error(error));
      },
      complete: () => { }
    });
    if (user) {
      return of(user);
    } else {
      return throwError(() => new Error('Invalid username or password'));
    }

  }

  logout() {
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}
