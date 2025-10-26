/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { ElectronAPI } from '../core/models/ElectronAPI';

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
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

  async saveDialog(defaultName: string): Promise<string | null> {
    if (!this.isElectron || !this.api) return null;
    return await this.api.saveFile(defaultName);
  }

  async selectFile(): Promise<string | null> {
    if (!this.isElectron || !this.api) return null;
    return await this.api.selectFile();
  }

  async runQuery(query: string, params: any[] = []): Promise<any> {
    if (!this.isElectron || !this.api?.runQuery) {
      console.warn('SQLite non disponible dans le mode web');
      return null;
    }
    return await this.api.runQuery(query, params);
  }

  async runExec(query: string, params: any[] = []): Promise<any> {
    if (!this.isElectron || !this.api?.runExec) {
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

  async importExcel(table: string, filePath: string): Promise<{ success: boolean; count: number }> {
    if (!this.isElectron || !this.api?.importExcel) return { success: false, count: 0 };
    return await this.api.importExcel(table, filePath);
  }

  async exportExcel(table: string, filePath: string): Promise<{ success: boolean; count: number }> {
    if (!this.isElectron || !this.api?.exportExcel) return { success: false, count: 0 };
    return await this.api.exportExcel(table, filePath);
  }
}
