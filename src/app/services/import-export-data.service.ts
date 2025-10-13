import { Injectable } from '@angular/core';
/**
 * import * as XLSX from 'xlsx';
 * import { saveAs } from 'file-saver';
 */

@Injectable({
  providedIn: 'root',
})
export class ImportExportDataService {
  constructor() {}

  /**
   * Export data from JSON to Excel file (.xslx)
   * @param data - Data to export
   * @param fileName - filename to generate
   */
  exportToExcel(data: any[], fileName: string = 'export.xlsx'): void {
    /*
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { Feuille1: worksheet }, SheetNames: ['Feuille1'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octect-stream' });
    saveAs(blob, fileName);
    */
  }

  /**
   * Import an Excel file and convert it to JSON objects
   * @param file - Excel file (.xlsx)
   * @returns Promise<any[]> - Converted data
   */

  /*
  importFromExcel(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const workbook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const sheetName: string = workbook.SheetNames[0];
        const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        resolve(data);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  }
    */
}
