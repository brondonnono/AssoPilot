import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User } from '../../../../../core/models/User';
import { ActionType } from '../../../../../core/enums/ActionType.enum';

@Component({
  selector: 'app-create-edit-user',
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
    TranslatePipe,
  ],
  templateUrl: './create-edit-user.component.html',
  styleUrl: './create-edit-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditUserComponent implements OnInit {
  ActionType = ActionType;
  userForm!: FormGroup;
  userRoles = ['admin', 'super_admin'];
  hide = signal(true);
  isLoading = false;
  canEdit = false;
  data: {
    mode: ActionType;
    user?: User;
  } = inject(MAT_DIALOG_DATA);

  constructor(public dialogRef: MatDialogRef<CreateEditUserComponent>, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.canEdit = this.data.mode !== ActionType.SHOW;
    this.initForm();
    if (this.data.mode !== ActionType.CREATE && this.data.user) this.patchForm(this.data.user);
  }

  initForm() {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: [this.userRoles[0], Validators.required],
    });
    if (!this.canEdit) this.userForm.disable();
  }

  patchForm(userData: User) {
    this.userForm.patchValue({
      username: userData.username,
      password: '',
      role: userData.role,
    });
  }

  get username() {
    return this.userForm.get('username');
  }

  get password() {
    return this.userForm.get('password');
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  save() {
    this.dialogRef.close('_SAVED');
  }
}
