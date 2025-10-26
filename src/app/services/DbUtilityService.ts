import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DbUtilityService {
  generateUUID() {
    return crypto.randomUUID();
  }

  getCurrentDate() {
    return new Date().toISOString();
  }
}
