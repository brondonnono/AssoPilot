import { Component, inject, OnInit } from '@angular/core';
import { Log } from '../../../core/models/Log';
import { DatePipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { ColumnTemplateDirective } from '../../../core/directives/ColumnTemplate.directive';
import { TableComponent } from '../../../shared/components/table/table.component';
import { MatButtonModule } from '@angular/material/button';
import { LogService } from '../../../services/log.service';
import { NotificationsService } from '../../../services/notifications.service';

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
export class Logs implements OnInit {
  private logService = inject(LogService);
  notificationService = inject(NotificationsService);

  logs: Log[] = [];
  isFetchingData = false;
  displayedColumns = ['user', 'action', 'created_at'];

  ngOnInit(): void {
    this.fetchLogs();
  }

  async fetchLogs() {
    this.isFetchingData = true;
    try {
      this.logs = await this.logService.getAll();
      console.log(this.logs);
    } catch (error) {
      console.error('Get logs error: ', error);
      this.notificationService.showMessage('Error fetching logs', true);
    } finally {
      this.isFetchingData = false;
    }
  }

  download() {
    console.log('export');
  }
}
