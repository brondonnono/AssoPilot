import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm',
  imports: [MatDialogModule, MatButtonModule, TranslatePipe],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmComponent {
  @Input() actionBtnLabel = 'yes';
  @Input() cancelBtnLabel = 'no';
  @Input() message = 'common.confirm-text';
}
