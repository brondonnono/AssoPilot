import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm',
  imports: [MatDialogModule, MatButtonModule, TranslatePipe],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmComponent {
  data?: {
    actionBtnLabel: string;
    cancelBtnLabel: string;
    message: string;
  } = inject(MAT_DIALOG_DATA);
  actionBtnLabel = 'yes';
  cancelBtnLabel = 'no';
  message = 'common.confirm-text';
}
