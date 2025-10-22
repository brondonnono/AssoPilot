/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

declare global {
  interface Window {
    electronAPI?: {
      openDialog: (options: any) => Promise<string[]>;
      runQuery?: (query: string, params?: any[]) => Promise<any>;
      getAppVersion?: () => Promise<string>;
    };
  }
}

@Injectable({ providedIn: 'root' })
export class ElectronService {
  private api = window.electronAPI;

  get isElectron(): boolean {
    return !!this.api;
  }

  async openDialog(options: any): Promise<string[]> {
    if (!this.isElectron || !this.api) return [];
    return await this.api.openDialog(options);
  }

  async runQuery(query: string, params: any[] = []): Promise<any> {
    if (!this.isElectron || !this.api?.runQuery) {
      console.warn('SQLite non disponible dans le mode web');
      return null;
    }
    return await this.api.runQuery(query, params);
  }

  async getAppVersion(): Promise<string> {
    if (!this.isElectron || !this.api?.getAppVersion) return 'web-dev';
    return await this.api.getAppVersion();
  }
}
