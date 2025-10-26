/* eslint-disable @typescript-eslint/no-explicit-any */
import { OpenDialogOptions, SaveDialogOptions } from 'electron';
import { User } from './User';

export interface ElectronAPI {
  openDialog: (options: OpenDialogOptions) => Promise<string[]>;
  saveDialog: (options: SaveDialogOptions) => Promise<string | null>;

  login: (
    username: string,
    password: string
  ) => Promise<{
    success: boolean;
    user?: User;
    message?: string;
  }>;

  runQuery: (query: string, params?: any[]) => Promise<any>;
  runExec: (query: string, params?: any[]) => Promise<any>;
  getAppVersion: () => Promise<string>;

  // ---------------- Excel ----------------
  importExcel: (table: string, filePath: string) => Promise<{ success: boolean; count: number }>;
  exportExcel: (table: string, filePath: string) => Promise<{ success: boolean; count: number }>;
  selectFile: () => Promise<string | null>;
  saveFile: (defaultName: string) => Promise<string | null>;
}
