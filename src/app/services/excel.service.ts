import { Injectable, inject } from '@angular/core';
import { ElectronService } from './electron.service';

@Injectable({ providedIn: 'root' })
export class ExcelService {
  private electron = inject(ElectronService);

  async selectFile(): Promise<string | null> {
    return await this.electron.selectFile();
  }

  async saveFile(defaultName: string): Promise<string | null> {
    return await this.electron.saveDialog(defaultName);
  }

  /**
   * @param table
   * @param filePath
   */
  async importExcel(table: string, filePath: string): Promise<{ success: boolean; count: number }> {
    return await this.electron.importExcel(table, filePath);
  }

  /**
   * @param table
   * @param filePath
   */
  async exportExcel(table: string, filePath: string): Promise<{ success: boolean; count: number }> {
    return await this.electron.exportExcel(table, filePath);
  }
}
