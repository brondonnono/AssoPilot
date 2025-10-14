import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { MockDataService } from '../../../services/MockData.service';
import { Event as IEvent } from '../../../core/models/Event';
import { EventTable } from '../../../shared/components/event-table/event-table';
import { ActionType } from '../../../core/enums/ActionType.enum';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import { ImportExportDataService } from '../../../services/import-export-data.service';
import { CreateEditEventComponent } from './components/create-edit-event/create-edit-event.component';

@Component({
  selector: 'app-events',
  imports: [
    TranslatePipe,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    EventTable,
    MatDialogModule,
  ],
  templateUrl: './events.html',
  styleUrl: './events.scss',
})
export class Events implements OnInit {
  readonly dialog = inject(MatDialog);
  events: IEvent[] = [];
  isFetchingData = false;

  constructor(
    private mockDataService: MockDataService,
    private exportDataService: ImportExportDataService
  ) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents() {
    this.isFetchingData = true;
    this.mockDataService.getEvents().subscribe({
      next: (res) => {
        this.events = res;
      },
      error: (error) => {
        this.isFetchingData = false;
        console.log('Get events error: ', error);
      },
      complete: () => {
        this.isFetchingData = false;
      },
    });
  }

  add() {
    this.openCreateEditEventModal(ActionType.CREATE).subscribe((res) => {
      if (res === '_SAVED') this.fetchEvents();
    });
  }

  download() {
    this.exportDataService.exportToExcel(this.events, 'events.xlsx');
  }

  edit(event: IEvent) {
    this.openCreateEditEventModal(ActionType.EDIT, event).subscribe((res) => {
      if (res === '_SAVED') this.fetchEvents();
    });
  }

  openCreateEditEventModal(action: ActionType, event?: IEvent) {
    const dialogRef = this.dialog.open(CreateEditEventComponent, {
      height: 'auto',
      width: '600px',
      data: {
        mode: action,
        event: event,
      },
    });
    return dialogRef.afterClosed();
  }

  handleEventAction(event: any) {
    const { action: action, data } = event;
    if (action === ActionType.DELETE) {
      this.openConfirmModal();
      console.log(event);
    }
  }

  openConfirmModal() {
    const dialogRef = this.dialog.open(ConfirmComponent);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
