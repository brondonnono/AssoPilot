/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { OpenDialogOptions } from 'electron';
import { User } from '../core/models/User';

declare global {
  interface Window {
    electronAPI?: {
      openDialog: (options: OpenDialogOptions) => Promise<string[]>;
      login: (
        username: string,
        password: string
      ) => Promise<{
        success: boolean;
        user?: User;
        message?: string;
      }>;
      runQuery: (query: string, params?: any[]) => Promise<any>;
      getAppVersion: () => Promise<string>;
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

  async login(username: string, password: string) {
    if (!this.api?.login) return { success: false, message: 'Electron API non disponible' };
    return await this.api.login(username, password);
  }
}
