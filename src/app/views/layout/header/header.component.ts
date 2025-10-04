import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { User } from '../../../core/models/User';
import { UserRole } from '../../../core/enums/UserRole.enum';
import { AuthService } from '../../../services/auth-service';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { logout } from '../../../core/state/auth/auth.actions';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatTooltipModule, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  readonly dialog = inject(MatDialog);
  @Output() sidebarToggle = new EventEmitter<void>();
  appName = 'ASSOPILOT';
  currentUser!: User;

  constructor(private authService: AuthService) {
    this.currentUser = {
      id: '1',
      username: 'Brondon Nono',
      password: '',
      role: UserRole.ADMIN,
      created_at: '',
    };
  }

  sidebarButtonClick() {
    this.sidebarToggle.emit();
  }

  logout() {
    this.openConfirmModal().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.authService.logout();
    });
  }

  openConfirmModal() {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        message: 'common.logout-msg',
      },
    });
    return dialogRef.afterClosed();
  }
}
