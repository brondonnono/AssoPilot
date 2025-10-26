/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActionType } from '../../../../../core/enums/ActionType.enum';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NotificationsService } from '../../../../../services/notifications.service';
import { EventService } from '../../../../../services/event.service';
import { Event as IEvent } from '../../../../../core/models/Event';
import { Member } from '../../../../../core/models/Member';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MemberService } from '../../../../../services/member.service';

@Component({
  selector: 'app-create-edit-event',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    TranslatePipe,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }, provideMomentDateAdapter()],
  templateUrl: './create-edit-event.component.html',
  styleUrl: './create-edit-event.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditEventComponent implements OnInit {
  ActionType = ActionType;
  membersList: Member[] = [];
  eventForm!: FormGroup;
  isLoading = false;
  isFetchingData = false;
  canEdit = false;
  readonly dateFormat = 'JJ/MM/AAAA - JJ/MM/AAAA';
  data: {
    mode: ActionType;
    event?: IEvent;
  } = inject(MAT_DIALOG_DATA);
  private readonly _adapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);
  private readonly _locale = signal(inject<unknown>(MAT_DATE_LOCALE));
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<CreateEditEventComponent>);
  eventService = inject(EventService);
  notificationService = inject(NotificationsService);
  memberService = inject(MemberService);
  translate = inject(TranslateService);

  ngOnInit(): void {
    if (this.translate.getCurrentLang() === 'en') {
      this._adapter.setLocale('en-US');
      this._locale.set('en');
    }
    this.canEdit = this.data.mode !== ActionType.SHOW;
    this.initForm();
    if (this.data.mode !== ActionType.CREATE && this.data.event) this.patchForm(this.data.event);
  }

  initForm() {
    this.eventForm = this.fb.group({
      label: ['', Validators.required],
      location: ['', Validators.required],
      description: [''],
      members: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
    });
    if (!this.canEdit) {
      this.eventForm.disable();
      this.eventForm.get('members')?.enable();
    }
    this.fetchMembers();
  }

  async fetchMembers() {
    this.isFetchingData = true;
    try {
      this.membersList = await this.memberService.getAll();
    } catch (error) {
      console.error('Get members error: ', error);
      this.notificationService.showMessage('Error fetching members', true);
    } finally {
      this.isFetchingData = false;
    }
  }

  patchForm(eventData: IEvent) {
    this.eventForm.patchValue({
      label: eventData.label,
      description: eventData.description,
      location: eventData.location,
      members: eventData.members,
      start_date: eventData.start_date,
      end_date: eventData.end_date,
    });
  }

  get start_date() {
    return this.eventForm.get('start_date');
  }

  get label() {
    return this.eventForm.get('label');
  }

  get description() {
    return this.eventForm.get('description');
  }

  get location() {
    return this.eventForm.get('location');
  }

  get end_date() {
    return this.eventForm.get('end_date');
  }

  get members() {
    return this.eventForm.get('members');
  }

  compareMembers(m1: Member, m2: Member): boolean {
    return !!m1 && !!m2 && m1.id === m2.id;
  }

  async save() {
    this.isLoading = true;

    try {
      const eventData = this.eventForm.value;

      if (this.data.mode === ActionType.CREATE) {
        await this.eventService.add(eventData);
        this.notificationService.showMessage('✅ Event created successfully');
      } else if (this.data.mode === ActionType.EDIT && this.data.event) {
        const updatedEvent: IEvent = { ...this.data.event, ...eventData };
        await this.eventService.update(updatedEvent);
        this.notificationService.showMessage('✅ Event updated successfully');
      }

      this.dialogRef.close('_SAVED');
    } catch (error: any) {
      console.error('Error saving events:', error);

      if (error.message.includes('event name already taken')) {
        this.notificationService.showMessage(
          '⚠️ event name already in use. Please choose another.',
          true
        );
      } else {
        this.notificationService.showMessage('❌ An error occurred while saving the event.', true);
      }
    } finally {
      this.isLoading = false;
    }
  }
}
