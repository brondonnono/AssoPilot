import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { Cotisation } from '../../../../../core/models/Cotisation';
import { Period } from '../../../../../core/enums/Period.enum';
import { ActionType } from '../../../../../core/enums/ActionType.enum';
import { Member } from '../../../../../core/models/Member';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NotificationsService } from '../../../../../services/notifications.service';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-create-edit-cotisation',
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
  providers: [provideNativeDateAdapter()],
  templateUrl: './create-edit-cotisation.component.html',
  styleUrl: './create-edit-cotisation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditCotisationComponent implements OnInit {
  ActionType = ActionType;
  cotisationForm!: FormGroup;
  membersList: Member[] = [];
  periodList: Period[] = [Period.DAY, Period.WEEK, Period.MONTH, Period.YEAR];
  isLoading = false;
  isFetchingData = false;
  canEdit = false;
  data: {
    mode: ActionType;
    cotisation?: Cotisation;
  } = inject(MAT_DIALOG_DATA);

  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<CreateEditCotisationComponent>);
  userService = inject(UserService);
  notificationService = inject(NotificationsService);

  ngOnInit(): void {
    this.canEdit = this.data.mode !== ActionType.SHOW;
    this.initForm();
    if (this.data.mode !== ActionType.CREATE && this.data.cotisation)
      this.patchForm(this.data.cotisation);
  }

  get title() {
    return this.cotisationForm.get('title');
  }

  get amount() {
    return this.cotisationForm.get('amount');
  }

  get frequency() {
    return this.cotisationForm.get('frequency');
  }

  get start_date() {
    return this.cotisationForm.get('start_date');
  }

  get members() {
    return this.cotisationForm.get('members');
  }

  initForm() {
    this.cotisationForm = this.fb.group({
      title: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1000)]],
      frequency: [Period.WEEK, Validators.required],
      start_date: ['', [Validators.required]],
      members: [[], [Validators.required, this.minSelectedMembersValidator(2)]],
    });
    this.cotisationForm.get('start_date')?.disable();
    if (!this.canEdit) {
      this.cotisationForm.disable();
      this.cotisationForm.get('members')?.enable();
    }
  }

  patchForm(cotisationData: Cotisation) {
    this.cotisationForm.get('start_date')?.disable();
    if (!this.canEdit) {
      this.cotisationForm.disable();
      this.cotisationForm.get('members')?.enable();
    }
    this.cotisationForm.setValue({
      title: cotisationData.title,
      amount: cotisationData.amount,
      frequency: cotisationData.frequency,
      start_date: cotisationData.start_date,
      members: cotisationData.members,
    });
  }

  compareMembers(m1: Member, m2: Member): boolean {
    return !!m1 && !!m2 && m1.id === m2.id;
  }

  save() {
    this.dialogRef.close('_SAVED');
    console.log(this.cotisationForm.value);
  }

  minSelectedMembersValidator(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || [];
      return value.length >= min ? null : { minSelected: true };
    };
  }
}
