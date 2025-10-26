import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActionType } from '../../../../../core/enums/ActionType.enum';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationsService } from '../../../../../services/notifications.service';
import { EventService } from '../../../../../services/event.service';
import { Event as IEvent } from '../../../../../core/models/Event';

@Component({
  selector: 'app-create-edit-event',
  imports: [],
  templateUrl: './create-edit-event.component.html',
  styleUrl: './create-edit-event.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditEventComponent implements OnInit {
  ActionType = ActionType;
  eventForm!: FormGroup;
  isLoading = false;
  canEdit = false;
  data: {
    mode: ActionType;
    event?: IEvent;
  } = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<CreateEditEventComponent>);
  eventService = inject(EventService);
  notificationService = inject(NotificationsService);

  ngOnInit(): void {}
}
