import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
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
import { Member } from '../../../../../core/models/Member';
import { MemberStatus } from '../../../../../core/enums/MemberStatus.enum';
import { ActionType } from '../../../../../core/enums/ActionType.enum';

@Component({
  selector: 'app-create-edit-member',
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
  templateUrl: './create-edit-member.component.html',
  styleUrl: './create-edit-member.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditMemberComponent implements OnInit {
  ActionType = ActionType;
  memberForm!: FormGroup;
  statusList = [MemberStatus.INACTIVE, MemberStatus.ACTIVE, MemberStatus.IN_REVIEW];
  isLoading = false;
  canEdit = false;
  data: {
    mode: ActionType;
    member?: Member;
  } = inject(MAT_DIALOG_DATA);

  constructor(public dialogRef: MatDialogRef<CreateEditMemberComponent>, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.canEdit = this.data.mode !== ActionType.SHOW;
    this.initForm();
    if (this.data.mode !== ActionType.CREATE && this.data.member) this.patchForm(this.data.member);
  }

  initForm() {
    this.memberForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(9)]],
      cni: [
        '',
        [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(9),
          Validators.pattern(/^\d{9}$/),
        ],
      ],
      status: [MemberStatus.IN_REVIEW, Validators.required],
    });
    if (!this.canEdit) this.memberForm.disable();
  }

  patchForm(memberData: Member) {
    this.memberForm.patchValue({
      name: memberData.name,
      phone: memberData.phone,
      cni: memberData.cni,
      status: memberData.status,
    });
  }

  get name() {
    return this.memberForm.get('name');
  }

  get phone() {
    return this.memberForm.get('phone');
  }

  get cni() {
    return this.memberForm.get('cni');
  }

  get status() {
    return this.memberForm.get('status');
  }

  save() {
    this.dialogRef.close('_SAVED');
  }
}
