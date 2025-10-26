/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { Event as IEvent } from '../../../core/models/Event';
import { EventTable } from '../../../shared/components/event-table/event-table';
import { ActionType } from '../../../core/enums/ActionType.enum';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import { CreateEditEventComponent } from './components/create-edit-event/create-edit-event.component';
import { NotificationsService } from '../../../services/notifications.service';
import { EventService } from '../../../services/event.service';

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
  notificationService = inject(NotificationsService);
  private eventService = inject(EventService);

  events: IEvent[] = [];
  isFetchingData = false;

  ngOnInit(): void {
    this.fetchEvents();
  }

  async fetchEvents() {
    this.isFetchingData = true;
    try {
      this.events = await this.eventService.getAll();
      console.log(this.events);
    } catch (error) {
      console.error('Get event error: ', error);
      this.notificationService.showMessage('Error fetching events', true);
    } finally {
      this.isFetchingData = false;
    }
  }

  async add() {
    const result = await this.openCreateEditEventModal(ActionType.CREATE).toPromise();
    if (result === '_SAVED') this.fetchEvents();
  }

  download() {
    console.log('export');
  }

  async remove(event: IEvent) {
    const result = await this.openConfirmModal().toPromise();
    if (result) {
      try {
        await this.eventService.delete(event.id);
        this.fetchEvents();
        this.notificationService.showMessage('Event deleted successfully');
      } catch (error) {
        console.error('Error deleting event:', error);
        this.notificationService.showMessage('Error deleting event', true);
      }
    }
  }

  async edit(event: IEvent) {
    const result = await this.openCreateEditEventModal(ActionType.EDIT, event).toPromise();
    if (result === '_SAVED') this.fetchEvents();
  }

  view(event: IEvent) {
    this.openCreateEditEventModal(ActionType.SHOW, event);
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

  handleEventAction(event: { action: ActionType; data: IEvent }) {
    if (event.action === ActionType.DELETE) {
      this.remove(event.data);
    } else if (event.action === ActionType.SHOW) this.view(event.data);
  }

  openConfirmModal() {
    const dialogRef = this.dialog.open(ConfirmComponent);
    return dialogRef.afterClosed();
  }
}
