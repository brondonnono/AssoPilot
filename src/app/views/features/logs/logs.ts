import { Component } from '@angular/core';
import { ImportExportDataService } from '../../../services/import-export-data.service';
import { MockDataService } from '../../../services/MockData.service';
import { Log } from '../../../core/models/Log';
import { DatePipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { ColumnTemplateDirective } from '../../../core/directives/ColumnTemplate.directive';
import { TableComponent } from '../../../shared/components/table/table.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-logs',
  imports: [
    TranslatePipe,
    MatTooltipModule,
    MatDialogModule,
    MatButtonModule,
    TableComponent,
    DatePipe,
    ColumnTemplateDirective,
  ],
  templateUrl: './logs.html',
  styleUrl: './logs.scss',
})
export class Logs {
  logs: Log[] = [];
  isFetchingData = false;
  displayedColumns = ['user', 'action', 'created_at'];
  constructor(
    private mockDataService: MockDataService,
    private exportDataService: ImportExportDataService
  ) {}

  ngOnInit(): void {
    this.fetchLogs();
  }

  fetchLogs() {
    this.isFetchingData = true;
    this.mockDataService.getLogs().subscribe({
      next: (res) => {
        this.logs = res;
      },
      error: (error) => {
        this.isFetchingData = false;
        console.log('Get logs error: ', error);
      },
      complete: () => {
        this.isFetchingData = false;
      },
    });
  }

  download() {
    this.exportDataService.exportToExcel(this.logs, 'logs.xlsx');
  }
}
